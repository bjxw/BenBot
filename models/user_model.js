const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userID:{
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    minorReports: {
        type: Number,
        required: true
    },
    majorReports: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;