const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Instance = new Schema(
    {
        _id: { type: String, required: true},
        templateID: { type: String, required: true },
        context: { type: String, required: true },
        states: { type: Object, required: true },
        role: {type: String, required: false},
        extraData: {type: Object, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('instance', Instance)
