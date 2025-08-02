const express = require("express");
const router = express.Router();
const ContactDetail = require("../models/ContactDetail");

router.post("/save", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new ContactDetail({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: "Contact details saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
