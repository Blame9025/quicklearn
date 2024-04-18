const db = require("../db.js");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    var userSave = await user.save();
    if(!userSave) return res.status(400).send({ code: "user_not_created" });

    const token = jwt.sign({ id: user.id },
    process.env.JWT_SECRET,
    {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
    });


    res.status(200).send({
        code: "user_created",
        id: user._id,
        name: user.name,
        email: user.email,
        documents: user.documents,
        accessToken: token
    });

};

exports.signin = async (req, res) => {
    var user = await User.findOne({
        email: req.body.email
    }).exec();
        

    if (!user) 
        return res.status(404).send({ code: "user_not_found" });
    

    var passwordIsValid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return res.status(401).send({
            accessToken: null,
            code: "invalid_password",
        });
    }

    const token = jwt.sign({ id: user.id },
    process.env.JWT_SECRET,
    {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
    });


    res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        documents: user.documents,
        accessToken: token
    });

};