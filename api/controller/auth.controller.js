const db = require("../db.js");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

exports.verify = async  (req, res) => {
    if(!req.body.token)
        return res.send({ code: "no_token" });
    try{
        const decode = jwt.verify(req.body.token, process.env.JWT_SECRET);
        const isExpired = Date.now() >= decode.exp * 1000
        if(isExpired)
            return res.send({
                code: "expired_token"
            })
        res.send({
            code: "success"
        })
    }catch(err){
        res.send({
            code: "invalid_token"
        })
    }
}
exports.signup = async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    var userSave = await user.save();
    if(!userSave) return res.status(400).send({ code: "user_not_created" });

    const token = jwt.sign({   
        id: user._id,
        name: user.name,
        email: user.email,
        documents: user.documents, 
    },
    process.env.JWT_SECRET,
    {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
    });


    res.status(200).send({
        code: "success",
        accessToken: token
    });

};

exports.signin = async (req, res) => {
    var user = await User.findOne({
        email: req.body.email
    }).exec();
        

    if (!user) 
        return res.send({ code: "user_not_found" });
    

    var passwordIsValid = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!passwordIsValid) {
        return res.send({
            code: "invalid_password",
        });
    }
    var documentsBackup = user.documents
    for(document in documentsBackup)
      delete documentsBackup[document].questions
    console.log(documentsBackup)
    const token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email,
        documents: documentsBackup,
    },
    process.env.JWT_SECRET,
    {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
    });


    res.status(200).send({
        code: "success",
        
        accessToken: token
    });

};