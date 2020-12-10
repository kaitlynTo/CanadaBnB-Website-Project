const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

//define the user schema
const roomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    description: String,
    location: {
        type: String,
        required: true
    },
    filename: {
        type:String,
        unique:true
    }
});



module.exports = mongoose.model("rooms", roomSchema);