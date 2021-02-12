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

/*
{
    "templateID": "newTemp",
    "role": "default-role",
    "context": "newTemp",
    "states": {
      "0": {
        "concurrent": false,
        "displayName": "/",
        "currentState": "state-ff6d12"
      },
      "machine-1": {
        "concurrent": false,
        "displayName": "/first",
        "currentState": null
      }
    }
  }
  */