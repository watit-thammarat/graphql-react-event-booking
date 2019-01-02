const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const { SECRET } = require('../../helpers/config');

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
  },

  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User does not exist!');
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error('Password is incorrect');
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, SECRET, {
        expiresIn: '1h'
      });
      return {
        userId: user.id,
        token,
        tokenExpiration: 1
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
};
