const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Length of your name is too short"],
        maxlength: [50, "Max length reached"]

    },
    host:{
        type: String,
        required: true,
       
    },
    year:{
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Length of your name is too short"],
        maxlength: [30, "Max length reached"]
    },
    branch:{
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Length of your name is too short"],
        maxlength: [50, "Max length reached"]
    },
    description:{
        type:String,
        required: true,
        trim:true
    },
    teamEntryDate:{
        type: Date,
        required: true
    },
    hostId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    projSubDate:{
        type: Date,
        required: true
    },
    status:{
        type:String,
        default: "ACTIVE",
        required: true
    },
    maxTeammateCount:{
        type: Number,
        default: 1,
        required: true
    }
    
},
{timestamps:true}

);

module.exports = mongoose.model("Assignment", assignmentSchema);