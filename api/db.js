const mongoose = require("mongoose");

const db = {}
db.mongoose = mongoose

db.user = require("./schemes/user.js");

module.exports = db;