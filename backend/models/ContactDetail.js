const mongoose = require("mongoose");

const contactDetailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
});

const ContactDetail = mongoose.model("ContactDetail", contactDetailSchema);

module.exports = ContactDetail;
