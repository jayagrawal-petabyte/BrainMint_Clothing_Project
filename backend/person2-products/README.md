# Person 2 Product Backend Module

This module contains the product, category, inventory, search, filter, sort, pagination, and admin product APIs for the BrainMint Clothing backend.

It is intentionally scoped under `backend/person2-products` so it can be reviewed and merged without touching teammates' authentication, cart, orders, payments, or deployment work.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose

## Setup

```bash
cd backend/person2-products
npm install
copy .env.example .env
npm run dev
```

Update `MONGO_URI` inside `.env` before starting the server.

## API Base URL

```text
http://localhost:5000/api
```

## Product APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/products` | Public | List products with pagination, search, filter, and sort |
| GET | `/products/:id` | Public | Get one product |
| GET | `/products/:id/cart-check?quantity=1` | Public | Validate product is active and has enough stock for cart |
| POST | `/products` | Admin | Create product |
| PUT | `/products/:id` | Admin | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/products/bestsellers` | Public | Bestseller products |
| GET | `/products/new-arrivals` | Public | Latest products |

## Product Query Examples

```text
GET /api/products?page=1&limit=10
GET /api/products?search=shirt
GET /api/products?category=categoryId&minPrice=500&maxPrice=2000
GET /api/products?brand=nike&inStock=true
GET /api/products?sort=price
GET /api/products?sort=-createdAt
```

## Cart and Order Integration for Person 3

Person 3 should store only `productId` in cart. For orders, store a product snapshot so order history stays accurate even if the product is edited or deleted later.

Cart/order fields supported by this module:

- `_id`
- `name`
- `price`
- `discountPrice`
- `images`
- `inventory.stock`
- `isActive`

Before adding a product to cart, check:

- `isActive === true`
- `inventory.stock > 0`
- requested quantity is less than or equal to `inventory.stock`

Optional cart validation endpoint:

```text
GET /api/products/:id/cart-check?quantity=2
```

Successful response:

```json
{
  "success": true,
  "message": "Product is available for cart",
  "data": {
    "_id": "PRODUCT_ID",
    "name": "Classic Cotton T-Shirt",
    "price": 799,
    "discountPrice": 599,
    "images": [],
    "inventory": {
      "stock": 50
    },
    "isActive": true,
    "orderSnapshot": {
      "productId": "PRODUCT_ID",
      "name": "Classic Cotton T-Shirt",
      "price": 799,
      "discountPrice": 599,
      "image": null
    }
  }
}
```

If Person 3 calls the shared Product model directly, use these helpers:

```js
const Product = require('../person2-products/src/models/Product');

const product = await Product.findAvailableForCart(productId, quantity);
const orderSnapshot = product.toOrderSnapshot();
const updatedProduct = await Product.decreaseStockForOrder(productId, quantity);
```

`decreaseStockForOrder` uses an atomic MongoDB update with this condition:

```js
{
  _id: productId,
  isActive: true,
  'inventory.stock': { $gte: quantity }
}
```

So stock will never go below `0`. If it returns `null`, the product is inactive or does not have enough stock.

## Category APIs

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/categories` | Public | List active categories |
| POST | `/categories` | Admin | Create category |
| PUT | `/categories/:id` | Admin | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |

## Temporary Admin Testing

Person 1 should replace `src/middleware/authMiddleware.js` with real JWT verification later. Until then, protected admin routes expect these headers:

```text
Authorization: Bearer test-token
x-user-role: admin
```

## Create Product Sample

```json
{
  "name": "Classic Cotton T-Shirt",
  "slug": "classic-cotton-t-shirt",
  "description": "Soft cotton t-shirt for everyday wear.",
  "brand": "UrbanWear",
  "category": "REPLACE_WITH_CATEGORY_ID",
  "price": 799,
  "discountPrice": 599,
  "images": [
    {
      "url": "https://example.com/tshirt.jpg",
      "alt": "Classic Cotton T-Shirt"
    }
  ],
  "inventory": {
    "sku": "TSHIRT-001",
    "stock": 50,
    "lowStockThreshold": 5
  },
  "isFeatured": true,
  "isBestseller": false,
  "isActive": true
}
```
