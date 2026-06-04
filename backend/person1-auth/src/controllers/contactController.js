const Contact =
require("../models/Contact");

exports.createContact =
async (req, res) => {

  try {

    const {
      name,
      email,
      subject,
      message
    } = req.body;

    const contact =
    await Contact.create({

      name,
      email,
      subject,
      message

    });

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact
    });

  } catch(error){
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Contacts retrieved successfully",
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};