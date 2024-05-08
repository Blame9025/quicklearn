const mongoose = require("mongoose");

const db = {}
db.mongoose = mongoose

db.user = require("./schemes/user.js");
db.document = require("./schemes/document.js");

module.exports = db;