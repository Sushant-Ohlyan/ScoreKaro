const Mongoose = require('mongoose');
const teamManageSchema = new Mongoose.Schema({
  teamName: { type: String, required: true },
  teamLogo: { type: String, required: true },
}, { timestamps: true });

module.exports = Mongoose.model('TeamManage', teamManageSchema);
