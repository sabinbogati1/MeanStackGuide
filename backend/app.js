const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) =>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Header", "Origin", "X-Requested-With, Content-Type, Accept") ;
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    next();
});

app.use("/api/posts", (req,res,next) =>{
    const posts = [
        {id: "1", title: "First Server Side post", content: "This is coming from server"},
        {id: "2", title: "Second Server Side post", content: "This is coming from server"}
    ];
    res.status(200).json({
        message: "Posts Fetched Successfully",
        posts: posts
    });
});

app.post("/api/posts", (req,res, next) => {
    const post = req.body;
    console.log("post --> ", req.body); 
    res.status(201).json({
        message: "Post added Successfully"
    });
})

module.exports = app;