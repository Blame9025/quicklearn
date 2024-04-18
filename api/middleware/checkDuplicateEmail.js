const db = require("../db.js");
const User = db.user;

checkDuplicateEmail = async (req, res, next) => { 
  try {
    user = await User.findOne({
      email: req.body.email
    }).exec();
    if (user) {
      res.status(400).send({ code: "already_in_use" });
      return;
    }
  } catch {

  }
  next();
};


module.exports = checkDuplicateEmail;