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

    post.save().then(createdPost => {
        console.log("Post Saved :: ", createdPost);
        res.status(201).json({
            message: "Post Added Successfully",
            postId: createdPost._id
        })
    });
});

app.get("/api/posts/:id", (req,res,next) =>{
    Post.findById(req.params.id).then(post =>{
        if(post){
            res.status(200).json(post);
        } else{
            res.status(404).json({message: "Post Not Found"})
        }
    })
})


app.put("/api/posts/:id", (req,res,next) =>{

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    })
    Post.updateOne({_id: req.params.id}, post ).then(result =>{
        res.status(200).json({message: "Update Successfull!!"});
    })

});

app.delete("/api/posts/:id",(req,res,next) =>{
    console.log(req.params.id);

    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.json(200).json({message: "Post Deleted"});
    });
})

module.exports = app;