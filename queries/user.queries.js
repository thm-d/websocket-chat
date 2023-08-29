const User = require("../database/models/user.model");

exports.createUser = async (user) => {
  try {
    const hashPassword = await User.hashPassword(user.password);
    const newUser = new User({
      local: {
        email: user.email,
        password: hashPassword,
      },
      username: user.username,
    });
    return newUser.save();
  } catch (err) {
    throw err;
  }
};

exports.findUserPerEmail = async (email) => {
  return User.findOne({ "local.email": email }).exec();
};

exports.findUserPerId = async (id) => {
  return User.findOne({ _id: id }).exec();
};
