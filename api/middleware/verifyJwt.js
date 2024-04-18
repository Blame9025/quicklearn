const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({ code: "no_token" });
    }

    jwt.verify(token,
    process.env.JWT_SECRET,
    (err, decoded) => {
        if (err) {
            return res.status(401).send({
                code: "access_denied",
            });
        }
        req.userId = decoded.id;
        next();
    });
};

module.exports = verifyToken;