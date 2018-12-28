const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = {
  createUser: async ({ userInput }) => {
    let { email, password } = userInput;
    try {
      let user = await User.findOne({ email });
      if (user) {
        throw new Error('User exists already.');
      }
      password = await bcrypt.hash(password, 12);
      user = new User({ email, password });
      user = await user.save();
      return { ...user._doc, password: null, _id: user.id };
    } catch (err) {
      throw err;
    }
  }
};
