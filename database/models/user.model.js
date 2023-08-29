const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcrypt");


const userSchema = schema({
  local: {
    email: { type: String, required: true, unique: true },
    password: { type: String }
  },
  username: String
});

userSchema.statics.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt); // promise
  } catch (err) {
    throw err;
  }
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.local.password) // promise (true / false)
}

const User = mongoose.model("user", userSchema);

module.exports = User