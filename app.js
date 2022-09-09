//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv').config();

console.log(process.env);

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
}); 

app.post('/', (req, res) => {
  const firstName = req.body.firstName
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    members : [
      {
        email_address : email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  
  const url = "https://us9.api.mailchimp.com/3.0/lists/267f49ac23";
  const api_key = process.env.API_KEY 
  const options = {
    method: "POST",
    auth: `younes:${api_key}`
  }

  const request = https.request(url , options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/succes.html")
    }else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData)
  request.end()
})

app.post('/failure', (req, res) => {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000...")
});