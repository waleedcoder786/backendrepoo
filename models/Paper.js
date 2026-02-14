const mongoose = require('mongoose');
const paperSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    paperName: String,
    paperType: String,
    paperDate: String,
    paperTime: String,
    className: String,
    subject: String,
    totalMarks: Number,
    batches: Array,
    headerInfo: { schoolName: String, address: String, logo: String, watermark: String },
    style: {
        fontFamily: { type: String, default: "font-sans" },
        lineHeight: { type: String, default: "1.5" },
        headingSize: { type: String, default: "18" },
        textSize: { type: String, default: "14" },
        textColor: { type: String, default: "#000000" },
        watermark: { type: String, default: "CONFIDENTIAL" },
        showWatermark: { type: Boolean, default: true },
        showBubbleSheet: { type: Boolean, default: false },
        showNote: { type: Boolean, default: false },
        noteText: String,
        logoUrl: String,
        layoutType: { type: String, default: "default" },
    },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Paper', paperSchema);