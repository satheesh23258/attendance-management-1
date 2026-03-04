const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  actionName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Task', taskSchema);
