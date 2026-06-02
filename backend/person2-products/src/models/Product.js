const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    public_id: String,
    alt: String
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      trim: true,
      unique: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true
    },
    brand: {
      type: String,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Product price cannot be negative']
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative']
    },
    images: {
      type: [imageSchema],
      default: []
    },
    sizes: {
      type: [String],
      default: []
    },
    colors: {
      type: [String],
      default: []
    },
    inventory: {
      sku: {
        type: String,
        required: [true, 'SKU is required'],
        unique: true,
        trim: true,
        uppercase: true
      },
      stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
      },
      lowStockThreshold: {
        type: Number,
        min: 0,
        default: 5
      },
      sold: {
        type: Number,
        min: 0,
        default: 0
      }
    },
    ratings: {
      average: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
      },
      count: {
        type: Number,
        min: 0,
        default: 0
      }
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ sizes: 1 });
productSchema.index({ colors: 1 });
productSchema.index({ isActive: 1, isBestseller: 1 });
productSchema.index({ isActive: 1, 'inventory.stock': 1 });

productSchema.methods.toOrderSnapshot = function toOrderSnapshot() {
  const primaryImage = this.images && this.images.length > 0 ? this.images[0] : null;

  return {
    productId: this._id,
    name: this.name,
    price: this.price,
    discountPrice: this.discountPrice,
    image: primaryImage
      ? {
          url: primaryImage.url,
          alt: primaryImage.alt
        }
      : null
  };
};

productSchema.statics.findAvailableForCart = function findAvailableForCart(productId, quantity = 1) {
  return this.findOne({
    _id: productId,
    isActive: true,
    'inventory.stock': { $gte: quantity }
  }).select('_id name price discountPrice images sizes colors inventory.stock inventory.sold inventory.sku isActive');
};

productSchema.statics.decreaseStockForOrder = function decreaseStockForOrder(productId, quantity, options = {}) {
  return this.findOneAndUpdate(
    {
      _id: productId,
      isActive: true,
      'inventory.stock': { $gte: quantity }
    },
    {
      $inc: {
        'inventory.stock': -quantity,
        'inventory.sold': quantity
      }
    },
    {
      new: true,
      runValidators: true,
      ...options
    }
  );
};

module.exports = mongoose.model('Product', productSchema);
