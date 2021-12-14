const express = require('express');
const app = express();
const Port = 8000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
require('dotenv').config();
// const express = require('express');
// const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('express-fileupload');
const csv = require('csvtojson');
// const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');


// Mongoose Connection
mongoose.connect(MONGOURI, 
  {
    useNewUrlParser: true, 
    useUnifiedTopology:true
  });
mongoose.connection.on("connected", ()=>{
    console.log("Successfully connected to database");
  });
mongoose.connection.on("error", (error)=>{
    console.log(error);
  });

// HBS Setup
const path = require("path");
hbs = require('hbs');
const template_path = path.join(__dirname, './templates/views');
const partials_path = path.join(__dirname, './templates/partials');
hbs.registerPartials(partials_path);
app.set("views", template_path);
app.set("view engine", "hbs");
app.use(express.static('public'))

// Models
 require('./models/Student');
 require('./models/teacher');
 require('./models/assignment');
 require('./models/group');
 require('./models/request');
const Student = mongoose.model("Student");
const Teacher = mongoose.model("Teacher");
const Assignment = mongoose.model("Assignment");
const Group = mongoose.model("Group");
const Request = mongoose.model("Request");
require('./models/teacher');


// Middleware
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(upload());
app.use(cookieParser());
// const {signin} = require('./middleware/signin')


app.listen(Port, ()=>{
    console.log(`Server is running on port ${Port}`);
});