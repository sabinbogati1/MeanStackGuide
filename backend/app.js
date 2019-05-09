const express = require("express");

const app = express();

app.use("/api/posts", (req,res,next) =>{
    const posts = [
        {id: "1", title: "First Server Side post", content: "This is coming from server"},
        {id: "2", title: "Second Server Side post", content: "This is coming from server"}
    ];
    res.status(200).json({
        message: "Posts Fetched Successfully",
        posts: posts
    });
})

// app.use((req,res,next) =>{
//     console.log("First Middleware");
//     next();
// });

// app.use((req, res,next)  =>{
//     res.send("Hello From Express");
// });

module.exports = app;