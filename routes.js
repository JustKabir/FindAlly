require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('express-fileupload');
const csv = require('csvtojson');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

// middleware
// router.use(upload());
// router.use(cookieParser());

router.get('/', (req,res)=>{
    res.send("dsa");
});
