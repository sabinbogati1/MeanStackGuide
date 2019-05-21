const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Routes
const postsRoutes = require("./routes/posts");

//CORS
var cors = require('cors');

const app = express();

//DB Config
const db = require("./config/keys").mongoURI;


//Connect to MongoDB
mongoose.connect(db)
.then(() => console.log("MongoDB Connected.."))
.catch(err => console.log("err -->",err));

//Using CORS
app.use(cors());

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Use Routes
app.use("/api/posts",postsRoutes);

module.exports = app;