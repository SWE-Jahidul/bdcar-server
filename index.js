const express = require("express");
const app = express();
const client = require('twilio')("AC462d3b9dfcf8a256c9c062f03a516563", "25c594a739ec36b0281554c049c8f534");

const cors = require("cors");
require("dotenv").config();

const { response } = require("express");
const port = process.env.PORT || 3000;

// firebase admin initialization

// Middle ware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {

  sendTextMessages()

  res.send("Bd-car is running ");
});

app.listen(port, () => {
  console.log(` listening at${port}`);
});


function sendTextMessages(){

  client.messages.create({
    body: 'Hello from Jahid',
    to: '+880 1738 002115',
    from: '+19378712181'
 }).then(message => console.log(message))
   // here you can implement your fallback code
   .catch(error => console.log(error))
}