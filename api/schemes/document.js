const mongoose = require('mongoose');

const document = new mongoose.Schema({
  fileName: { type: String, required: true },
  questions: { type: Object, required: true },
});

module.exports = mongoose.model('Document', document, "documents");