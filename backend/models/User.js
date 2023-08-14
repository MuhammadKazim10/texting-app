const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  online: { type: Boolean, default: false }
  // Other fields can be added here
});

const User = mongoose.model('User', userSchema);

module.exports = User;
