const express = require("express");
const exphbs = require("express-handlebars");
const path = require('path');
const fs = require("fs");
const multer = require('multer');
const _ = require('underscore');
const mongoose = require('mongoose');
const PHOTODIRECTORY = './public/photos/';
const HTTP_PORT = process.env.PORT || 8080;
require('dotenv').config();
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const { ESRCH } = require("constants");
const methodOverride = require("method-override");
const clientSessions = require('client-sessions');
const RoomModel = require("./models/roomModel");

/*require routers*/
const userRoutes = require("./routes/users");
const roomRoutes = require("./routes/rooms");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*MongoDB server connection and setup*/
//connect to the mongoDB database
mongoose.connect(process.env.CONNECTIONSTR,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
var db = mongoose.connection;
//log when the db is connected
db.on("error", console.log.bind(console, "DB connection error."));
db.once("open", () => console.log("DB connection success"));


function onHttpStart() {
    console.log(`Express http server listening on: ${HTTP_PORT}`);
}

app.use(clientSessions({
    cookieName:"session",
    secret:"airbnb_client_session",
    duration: 2 * 60 * 1000,
    activeDuration: 1000* 60 * 2, //if inactive for this time, session will automatically destroyed
}));


/*Register handlebars as the rendering engine for views*/
app.set("views", "./views");
app.engine(".hbs", exphbs({
    extname: ".hbs",
    defaultLayout: "main"
}));
app.set("view engine", ".hbs");


// override the POST
app.use(methodOverride('_method'));
/*Setup static folders that static resources can load from*/
app.use(express.static("./views/"));
app.use(express.static("./public/"));
app.use(express.urlencoded({ extended: false }));

/*Routes use*/
app.use("/", userRoutes);
app.use("/", roomRoutes);

app.get("/", (req, res) => {
    res.render("home",{user:req.session.user});
})


app.listen(HTTP_PORT, onHttpStart);