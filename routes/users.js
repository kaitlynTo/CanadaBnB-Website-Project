const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const UserModel = require("../models/userModel");
require('dotenv').config();


/*Nodemailer transporter info*/
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.TRANSPORTER_USER,
        pass: process.env.TRANSPORTER_PASS
    }
});

router.get("/signup", (req, res) => {
    res.render("signup");
})

/*after registration*/
router.get("/dashboard", (req, res) => {
    res.render("dashboard.hbs");
})

/*register form goes to*/
router.post("/dashboard", (req, res) => {
    //server-side validation
    const errors = [];
    if (req.body.email == "")
        errors.push("Email must be entered");
    if (req.body.fname == "")
        errors.push("First name must be entered");
    if (req.body.lname == "")
        errors.push("Last name must be entered");
    if (req.body.birthday == "")
        errors.push("Birthday must be selected");
    if (req.body.password == "") {
        errors.push("Password must be entered");
    }
    else {
        const pwPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/;
        if (!req.body.password.match(pwPattern))
            errors.push("Password - 6-16 characters. At least 1 lower, uppercase and number");

        if (req.body.password != req.body.passwordConfirm)
            errors.push("Password confirm doesn't match");
    }

    UserModel.findOne({ email: req.body.email }) //if the email already exists,
        .then(user => {
            if (user != null) {
                console.log(req.body.email);
                errors.push("This email is already registred.");
                console.log(errors);
                res.render('dashboard.hbs', { message: errors });
            }
            else {
                const FORM_DATA = req.body;
                var User = new UserModel({
                    firstname: FORM_DATA.fname,
                    lastname: FORM_DATA.lname,
                    email: FORM_DATA.email,
                    birthday: FORM_DATA.birthday,
                    password: FORM_DATA.password,
                    isAdmin: FORM_DATA.userOrOwner
                });

                
                if (errors.length == 0){
                    //save the document into the DB
                    UserModel.hashing(User, (err, doc) => {
                        if (err) {
                            console.error(err);
                        }
                    })

                     //send a confirmation email
                var emailOptions = {
                    from: process.env.TRANSPORTER_USER,
                    to: req.body.email,
                    subject: "Thanks for the registration! - CanadaBnB",
                    html: '<p>Hello ' + req.body.fname + '!</p>' +
                        '<p>This is a confirmation for your successful registration at CanadaBnB.</p>' +
                        '<img src="cid:unique@nodemailer.com"/>',
                    attachments: [{
                        filename: 'logo.png',
                        path: './views/img/logo.png',
                        cid: 'unique@nodemailer.com'
                    }]
                };

                transporter.sendMail(emailOptions, (error, info) => {
                    if (error) {
                        console.log("ERROR: " + error);
                    } else {
                        console.log("SUCCESS: " + info.response);
                    }
                })

                    res.render('dashboard.hbs', { data: req.body });
                }
                else
                    res.render('dashboard.hbs', { message: errors });


               
            }

        });

});





router.get("/login", (req, res) => {
    if (!req.session.user) {
        res.render("login");
    }
    else if (req.session.user.isAdmin) {
        res.redirect("/adminDashboard");
    }
    else {
        res.redirect("/userDashboard");
    }
})


//when login form is submitted
router.post("/login", (req, res) => {

    /*server-side validation*/
    const errors = [];
    if (req.body.username === "") //email null check
        errors.push("Email must be filled out");
    if (req.body.password === "") //password null check
        errors.push("Password must be filled out");
    //if email or password has no value render the error message
    if (errors.length > 0) {
        return res.render("login.hbs", { message: errors });
    }

    //check the matching pair in the DB
    UserModel.findOne({ email: req.body.username })
        .then((user) => {
            if (user == null) { //if the email is not found
                errors.push('This email is not registered.');
                return res.render("login.hbs", { message: errors });
            }
            else //if the email is found 
            {
                const User = user;
                //compare password with hashed one
                bcrypt.compare(req.body.password, User.password)
                    .then((isMatched) => {
                        if (isMatched) {
                            //create session
                            if (User.isAdmin) //for admin
                            {
                                req.session.user = User;
                                console.log(req.session.user);
                                res.redirect("/adminDashboard");
                            }
                            else //for regualr user
                            {
                                req.session.user = User;
                                console.log(req.session.user);
                                res.redirect("/userDashboard");
                            }
                        }
                        else {
                            errors.push("Password is incorrect. Try again.");
                            return res.render("login.hbs", { message: errors });
                        }
                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
});

router.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/login");
});

router.get("/userDashboard", (req, res) => {
    if (req.session.user) {
        res.render("userDashboard", { user: req.session.user });
    }
    else
        res.redirect("/login");
})




module.exports = router;