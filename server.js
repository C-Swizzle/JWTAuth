require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

// middleware to handle json data
app.use(express.json());

const PORT = 8080;

const posts = [
    {
        name:"something",
        post:"hi there",
        ownedBy: "cmack"
    },
    {
        name:"something else",
        post:"hi how are you",
        ownedBy: "zskrilla"
    },
    {
        name:"a third post",
        post:"weezy",
        ownedBy:"vverma"
    }
]

const fakeUsers = [
    {
        username: "cmack",
        password: "kush123"
    },
    {
        username: "zskrilla",
        password: "fuckpineapples"
    },
    {
        username: "vverma",
        password: "juulallday"
    }
]

// authenticateToken is a middleware function, when next() is called within the function it continues.
app.get("/posts",authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.ownedBy===req.user.username))
})


app.post("/login", (req,res)=>{
    // Need to authenticate user here, will need access to DB to do so and hash/salt function
    
    const username = req.body.username;
    const serialize = {username};

    const accessToken = jwt.sign(serialize,process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken});
});

function authenticateToken(req,res,next){
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 
    if(token==null) return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err, serializedValue)=>{
        if(err) return res.sendStatus(403);
        req.user=serializedValue;
        next();
    })

}

app.listen(PORT, console.log(`listening on ${PORT}`))