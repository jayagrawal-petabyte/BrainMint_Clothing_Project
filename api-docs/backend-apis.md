# Backend APIs

## Product APIs
- GET /products
  - Dynamic catalog endpoint for frontend product listing.
  - Supports `page`, `limit`, `search`/`q`, `category`/`categorySlug`/`categories`, `brand`/`brands`, `size`/`sizes`, `color`/`colors`, `minPrice`, `maxPrice`, `inStock`, `featured`/`isFeatured`, `bestseller`/`isBestseller`, and `sort`.
  - Sort options include `newest`, `oldest`, `price-low`, `price-high`, `rating`, `bestseller`, and `name`.
  - Response includes `products`, `pagination`, selected `sort`, and available `filters`.
- POST /products
- PUT /products/:id
- DELETE /products/:id

## Category APIs
- GET /categories
- POST /categories

## Authentication APIs
- POST /register
- POST /login
- GET /profile
- ## Cart APIs
- POST /cart
- GET /cart

## Checkout APIs
- POST /checkout

## Order APIs
- POST /orders
- GET /orders

## Payment APIs
- Payment integration APIs

## Wishlist APIs
- POST /wishlist
- GET /wishlist


## Middleware
- Authentication middleware
- Admin authorization middleware

## Utilities
- JWT token generation
