const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
mongoose.Promise = require("bluebird");

//define the bookingInfo schema
const bookingInfoSchema = new Schema({
    checkInDate: Date,
    checkOutDate: Date,
    guestNum: Number,
    roomID: Number
});
//define the user schema
const userSchema = new Schema({
    firstname: {
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthday: Date,
    password:{
        type:String 
    },
    isAdmin: {
        type:Boolean,
        default: false
    },
    bookingInfo:[bookingInfoSchema]
});


module.exports = mongoose.model("users", userSchema);
module.exports.hashing = (newUser,cb) =>{
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err) throw err;
            newUser.password = hash;
            console.log("Hashed password is stored");
            newUser.save(cb);
            console.log(newUser.email + " has been saved to the DB");
        });
    });
}
