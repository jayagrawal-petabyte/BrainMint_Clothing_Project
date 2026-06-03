const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    isActive: {
      type: Boolean,
      default: true
    },
    source: {
      type: String,
      trim: true,
      default: 'footer'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.models.NewsletterSubscriber
  || mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
