// jshint esversion:6

//declaring modules
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const express = require("express");
const app = express();

//use html info in our js
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//get html via sendFile with path and 
app.get("/", (req,res)=>{

    //get path
    res.sendFile(__dirname + "/signup.html")

});
    
// Post data to mailchimp Servers

app.post("/", (req,res)=>{
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;

// declaring an object to store properties/attributes
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

//Convert JavaScript objects into strings
    const jsonData = JSON.stringify(data);

//request mailchimp to post data to its server

    const url = "https://us21.api.mailchimp.com/3.0/lists/3d652d1b59";

// declaring an object to store methods
    const options = {
        method : "POST",
        auth   : "rajengrad:79c6287e4f254b4f4238624b70167987-us21",
    }

//request made to mailchimp server to store
    const request = https.request(url, options, (response)=>{

        if(response.statuscode === 200){
            res.sendFile(__dirname + "/success.html")
            }else
            {res.sendFile(__dirname+ "/failure.html")}

            response.on("data",(data)=>{
            console.log(JSON.parse(data));
                        
        })
    
    }) 

    request.write(jsonData);
    request.end();
    

});
        app.post("/failure",(req,res)=>{
        res.redirect("/")
    })

app.listen(3000,()=>{
    console.log("Server is listening at port 3000")
});

//apiKey = 79c6287e4f254b4f4238624b70167987-us21
// unique audience ID: 3d652d1b59