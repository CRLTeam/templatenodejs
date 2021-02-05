const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Template = new Schema(
    {
        _id: { type: String, required: true},
        data: { type: String, required: true },
    },
    { timestamps: true },
)

module.exports = mongoose.model('template', Template);