const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const asyncHandler = require('../utils/asyncHandler');

const subscribeToNewsletter = asyncHandler(async (req, res) => {
  const { email, source } = req.body;

  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email: String(email || '').trim().toLowerCase() },
    { email, source, isActive: true },
    {
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
      upsert: true
    }
  );

  res.status(201).json({
    success: true,
    message: 'Newsletter subscription saved successfully',
    data: subscriber
  });
});

module.exports = {
  subscribeToNewsletter
};
