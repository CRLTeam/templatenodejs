const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Template = new Schema(
    {
        _id: { type: String, required: true},
        uid: { type: String, required: false },
        roles: { type: Object, required: false },
        machines: { type: Object, required: false },
    },
    { timestamps: true },
)

module.exports = mongoose.model('template', Template);