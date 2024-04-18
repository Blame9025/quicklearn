const verifyToken  = require("../middleware/verifyJwt.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/user", [verifyToken], (req, res) => {
    res.status(200).send("User Content.");
  });
};