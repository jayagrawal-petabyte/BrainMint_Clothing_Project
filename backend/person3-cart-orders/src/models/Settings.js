const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    shippingCost: {
      type: Number,
      default: 99
    },
    freeShippingThreshold: {
      type: Number,
      default: 2500
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/' },
      facebook: { type: String, default: 'https://facebook.com/' },
      twitter: { type: String, default: 'https://twitter.com/' }
    },
    enableAnnouncement: { type: Boolean, default: true },
    announcementText: { type: String, default: 'Free shipping on all orders over ₹999!' }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
