const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number },
    discountPrice: { type: Number },
    images: { type: Array, default: [] },
    inventory: {
      stock: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.statics.findAvailableForCart = function (productId, quantity = 1) {
  return this.findOne({
    _id: productId,
    isActive: true,
    'inventory.stock': { $gte: quantity }
  }).select('_id name price discountPrice images inventory.stock isActive');
};

productSchema.statics.decreaseStockForOrder = function (productId, quantity) {
  return this.findOneAndUpdate(
    {
      _id: productId,
      isActive: true,
      'inventory.stock': { $gte: quantity }
    },
    {
      $inc: {
        'inventory.stock': -quantity,
        soldCount: quantity
      }
    },
    { new: true, runValidators: true }
  );
};

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
