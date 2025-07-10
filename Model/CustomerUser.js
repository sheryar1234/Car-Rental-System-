const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAllowed: {
    type: Boolean,
    default: true, // Allowed by default
  },

});

// Hash password before saving the user
customerUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords during login
customerUserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('customerUser', customerUserSchema);
