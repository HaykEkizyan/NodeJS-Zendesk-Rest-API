const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    _id         : {type: Number},
    firstName   : {type:String, match: /[a-z]/},
    lastName    : {type:String, match: /[a-z]/},
    mail        : {type:String, match: /[a-z0-9A-Z]/},
    birthDate   : {type:Date, default : null},
    address     : {type:String, match: /[a-z0-9A-Z]/},
    address2    : {type:String, match: /[a-z0-9A-Z]/},
    country     : {type:String, match: /[a-z]/},
    city        : {type:String, match: /[a-z]/},
    postalCode  : {type:String, match: /[a-z0-9A-Z]/},
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);
