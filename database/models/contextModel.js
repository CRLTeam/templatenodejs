const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Context = new Schema(
    {
        _id: { type: String, required: true},
        templateID: {type: String, required: false},
        languages: { type: Object, required: false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('context', Context);