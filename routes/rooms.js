const express = require("express");
const router = express.Router();
const RoomModel = require("../models/roomModel");
require('dotenv').config();
const multer = require("multer");
const PHOTODIRECTORY = './public/photos/';
const path = require('path');
const fs = require('fs');
const UserModel = require("../models/userModel");

// make sure the photos folder exists
// if not create it
if (!fs.existsSync(PHOTODIRECTORY)) {
    fs.mkdirSync(PHOTODIRECTORY);
}

//photo files storage setup with renaming the file
const storage = multer.diskStorage({
    destination: PHOTODIRECTORY,
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });

router.get("/adminDashboard", (req, res) => {
    if (req.session.user) {
        RoomModel.find()
            .lean()
            .exec()
            .then((rooms) => {
                res.render("adminDashboard", { showTable: true, rooms: rooms, hasRooms: !!rooms.length, registerForm: false, user: req.session.user });
            })
    }
    else
        res.redirect("/login");
})

router.get("/adminDashboard/register_room", (req, res) => {
    if (req.session.user) {
        RoomModel.find()
            .lean()
            .exec()
            .then((rooms) => {
                res.render("adminDashboard", { onlyForm: true, hasRooms: !!rooms.length, registerForm: true, user: req.session.user });
            })
    }
    else {
        res.redirect("/login");
    }
})

//when posting a room
router.post("/adminDashboard/register_room", upload.single("photo"), (req, res) => {
    if (req.session.user) {

        const errors = [];

        if (req.file == null)
            errors.push("You must upload a picture");
        if (req.body.title == "")
            errors.push("You must enter the title of the room");
        if (req.body.price == "")
            errors.push("You must enter the price of the room with number");
        if (req.body.location == null)
            errors.push("You must enter the location of the room");
        if (req.body.description == "")
            errors.push("You must enter the description of the room");

        if (errors.length > 0)
            return res.render("adminDashboard", { registerForm: true, hasRooms: true, errors: errors, user: req.session.user });


        const Room = new RoomModel({
            title: req.body.roomtitle,
            price: req.body.roomprice,
            location: req.body.location,
            filename: req.file.filename,
            description: req.body.description
        });


        if (typeof Room.price != "number")
            errors.push("Please enter a number for the price");

        if (errors.length > 0)
            res.render("adminDashboard", { registerForm: true, hasRooms: true, errors: errors, user: req.session.user });
        else {

            Room.save()
                .then(room => {
                    console.log("Your photo was uploaded successfully");
                    res.redirect("/adminDashboard");
                })
                .catch(err => {
                    errors.push("There was an error registering your room.");
                    console.log(err);
                    res.render("adminDashboard", { errors: errors });
                })
        }

    }
    else {
        res.redirect("/login");
    }
})


router.get("/adminDashboard/edit", (req, res) => {
    if (req.session.user) {
        res.render("adminDashboard", { hasRooms: true, edit: true, user: req.session.user });
    }
    else {
        res.redirect("/login");
    }
})

router.get("/adminDashboard/edit/:roomid", (req, res) => {
    if (req.session.user) {
        const roomid = req.params.roomid;
        RoomModel.findOne({ _id: roomid })
            .lean()
            .exec()
            .then((room) => {
                res.render("adminDashboard", { user: req.session.user, room: room, edit: true, hasRooms: true })
            })
            .catch((err) => { console.log(err); });
    }
    else { res.redirect("/login"); }
})

router.post("/adminDashboard/edit/:filename", upload.single("photo"), (req, res) => {
    if (req.session.user) {

        const originalfilename = req.params.filename;
        const changingfilename = req.file.filename;

        const Room = new RoomModel({
            title: req.body.roomtitle,
            price: req.body.roomprice,
            location: req.body.location,
            description: req.body.description,
            filename: changingfilename
        });

        RoomModel.updateOne({ filename: originalfilename },
            {
                $set: {
                    title: Room.title,
                    price: Room.price,
                    location: Room.location,
                    description: Room.description,
                    filename: Room.filename
                }
            })
            .then((room) => {
                fs.unlink(PHOTODIRECTORY + originalfilename, (err) => {
                    if (err)
                        return console.log(err);
                    console.log("Removed file : " + originalfilename);
                });
                console.log(`${room._id} has been updated`);
                res.redirect("/adminDashboard")
            })
            .catch(err => console.log(err));

    }
    else { res.redirect("/login"); }
})

router.get("/adminDashboard/delete/:filename", (req, res) => {
    if (req.session.user) {

        const filename = req.params.filename;

        RoomModel.deleteOne({ filename: filename })
            .then(() => {
                fs.unlink(PHOTODIRECTORY + filename, (err) => {
                    if (err)
                        return console.log(err);
                    console.log("Removed file : " + filename);
                })
                res.redirect("/adminDashboard");
            })
    }
});


//search by location
router.post("/listing", (req, res) => {

    let message = "";

    if (req.body.city === "toronto") {
        RoomModel.find({ location: "Toronto" })
            .lean()
            .exec()
            .then(rooms => {
                message = "Toronto";
                res.render("listing", { city: message, rooms: rooms, hasRooms: !!rooms.length, user: req.session.user });
            })
            .catch(err => console.log(err));
    }

    if (req.body.city === "northyork") {
        RoomModel.find({ location: "North York" })
            .lean()
            .exec()
            .then(rooms => {
                res.render("listing", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user });
            })
            .catch(err => console.log(err));
    }

    if (req.body.city === "vancouver") {
        RoomModel.find({ location: "Vancouver" })
            .lean()
            .exec()
            .then(rooms => {
                res.render("listing", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user });
            })
            .catch(err => console.log(err));
    }

    if (req.body.city === "ottawa") {
        RoomModel.find({ location: "Ottawa" })
            .lean()
            .exec()
            .then(rooms => {
                res.render("listing", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user });
            })
            .catch(err => console.log(err));
    }


});



router.get("/listing", (req, res) => {
    RoomModel.find().lean()
        .exec()
        .then(rooms => {
            res.render("listing", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user });
        })
});

router.post("/listing", (req, res) => {
    RoomModel.find().lean()
        .exec()
        .then(rooms => {
            res.render("listing", { rooms: rooms, hasRooms: !!rooms.length, user: req.session.user });
        })
});

router.get("/roomInfo/:filename", (req, res) => {
    const filename = req.params.filename;
    RoomModel.find({filename:filename}).lean()
    .exec()
    .then(room=>{
        console.log(room);
        res.render("roomInfo", { user: req.session.user, room:room});
    })
});

router.get("/confirmation", (req, res) => {
    if(req.session.user)
    {
        res.render("confirmation.hbs", { user: req.session.user });

    }
    else
    {
        console.log("Login required to book a room");
        res.redirect('/login');
    }
});

router.post("/confirmation/:_id",(req,res)=>{
    if(req.session.user)
    {
        const roomid = req.params._id;
        //user.checkInDate / checkOutDate/ guestNum / roomID
        UserModel.findOne({email:req.session.user.email})
        .lean().exec()
        .then(user=>{
            var bookingObj = {
                checkInDate: req.body.checkin,
                checkOutDate: req.body.checkout,
                guestNum:req.body.guests,
                roomID: roomid
            };
            var User = new UserModel(user);
            User.bookingInfo.push(bookingObj);
            user = User;
            console.log(user);
          
            UserModel.updateOne({email: req.session.user.email}, user, function(err, raw) {
                if (err) {
                  console.log(err);
                  res.send(err);
                }
                console.log("booking information for the user successfully updated");
                res.render("confirmation.hbs", {room:bookingObj,user: req.session.user, user:user});
              });

        })

    }
    else
    {
        console.log("Login required to book a room");
        res.redirect('/login');
    }

})

module.exports = router;