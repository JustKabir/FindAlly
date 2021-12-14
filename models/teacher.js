const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Length of your name is too short"],
        maxlength: [50, "Max length reached"]

    },
    email:{
        type: String,
        unique: true,
        required: true,
        minlength: [6, "field length is too short"]
    },
    gender:{
        type:String,
        required: true,
        trim: true,
        minlength: [4, "Length of your name is too short"],
        maxlength: [6, "Max length reached"]
    },
    password:{
        type: String,
        required: true,
    },
    mobNo:{
        type: Number,
        required: true,
        trim: true
    },
    role:{
        type: String,
        trim: true,
        minlength: [2, "Length of your name is too short"],
        maxlength: [15, "Max length reached"]
    }

});

mongoose.model("Teacher", teacherSchema);