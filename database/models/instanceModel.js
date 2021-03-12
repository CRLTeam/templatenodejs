const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Instance = new Schema(
    {
        _id: { type: String, required: true},
        templateID: { type: String, required: true },
        context: { type: String, required: true },
        states: { type: String, required: true },
        role: String
    },
    { timestamps: true },
)

module.exports = mongoose.model('instance', Instance)
