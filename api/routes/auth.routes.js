const checkDuplicateUsernameOrEmail = require("../middleware/checkDuplicateEmail.js");
const controller = require("../controller/auth.controller.js");

module.exports = function(app) {

  app.post(
    "/api/auth/signup",
    [
      checkDuplicateUsernameOrEmail,
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/verify", controller.verify);
};