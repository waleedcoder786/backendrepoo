const mongoose = require('mongoose');
const classSchema = new mongoose.Schema({}, { strict: false });
module.exports = mongoose.model('Class', classSchema);