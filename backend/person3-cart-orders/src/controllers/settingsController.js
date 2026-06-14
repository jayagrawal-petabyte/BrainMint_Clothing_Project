const Settings = require('../models/Settings');

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      // Update top-level fields explicitly to avoid shallow Object.assign issues
      const { shippingCost, freeShippingThreshold, enableAnnouncement, announcementText, socialLinks } = req.body;

      if (shippingCost !== undefined) settings.shippingCost = shippingCost;
      if (freeShippingThreshold !== undefined) settings.freeShippingThreshold = freeShippingThreshold;
      if (enableAnnouncement !== undefined) settings.enableAnnouncement = enableAnnouncement;
      if (announcementText !== undefined) settings.announcementText = announcementText;

      // Deep merge socialLinks sub-document
      if (socialLinks && typeof socialLinks === 'object') {
        settings.socialLinks = {
          instagram: socialLinks.instagram ?? settings.socialLinks?.instagram ?? '',
          facebook: socialLinks.facebook ?? settings.socialLinks?.facebook ?? '',
          twitter: socialLinks.twitter ?? settings.socialLinks?.twitter ?? '',
        };
      }

      // Mark nested objects as modified so Mongoose persists them
      settings.markModified('socialLinks');
    }

    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
