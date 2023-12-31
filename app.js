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
    res.sendFile(__dirname + "/index.html")

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

    const url = "https://us21.api.mailchimp.com/3.0/lists/9665b1d1a3";

// declaring an object to store methods
    const options = {
        method : "POST",
        auth   : "rajengrad:695b25b2738e26fe973768736490c084-us21",
    }

//request made to mailchimp server to store
    const request = https.request(url, options, (response)=>{

        if(response.statusCode === 200){
                res.sendFile(__dirname + "/success.html")
            }else
            {
                res.sendFile(__dirname+ "/failure.html")
            }

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

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is listening at PORT")
});

//apiKey = 695b25b2738e26fe973768736490c084-us21
// unique audience ID: 9665b1d1a3