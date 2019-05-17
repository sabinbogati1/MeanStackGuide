const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//CORS
var cors = require('cors');

//Model
const Post = require("./models/post");

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

// app.use((req,res,next) =>{
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin", "X-Requested-With, Content-Type, Accept") ;
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
//     next();
// });

app.get("/api/posts", (req,res,next) =>{

    Post.find().then(documents => {
        res.status(200).json({
            message: "Posts Fetched Successfully",
            posts: documents
        });
    }).catch(err => {
        console.log("err in getting post..");
    })

   
});

app.post("/api/posts", (req,res, next) => {
    //const post = req.body;
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    post.save();

    console.log("post --> ", req.body);
    console.log("post --> ", post);  

    res.status(201).json({
        message: "Post added Successfully"
    });
});

app.delete("/api/posts/:id",(req,res,next) =>{
    console.log(req.params.id);

    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.json(200).json({message: "Post Deleted"});
    });
})

module.exports = app;