const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const { use } = require("../routes/userRoutes");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userCheck = await User.findOne({ username });
    if (userCheck)
      return res.json({
        message: "Username is already exits",
        status: false,
      });

    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ message: "Email is already exits", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = User.create({
      email: email,
      username: username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({
      status: true,
      user,
    });
    console.log(req.body);
  } catch (ex) {
    next(ex);
  }
};
module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({
        message: "Incorrect username or password",
        status: false,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ message: "Invalid Password", status: false });
    delete user.password;
    return res.json({
      status: true,
      user,
    });
    console.log(req.body);
  } catch (ex) {
    next(ex);
  }
};
