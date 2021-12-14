const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    groupId:{
        type: mongoose.Types.ObjectId,
        ref: 'Group'
    },
    memberId:{
        type: mongoose.Types.ObjectId,
        ref: 'Student'
    },
    decision:{
        type: Number,
        default: 0
    },
    name:{
        type:String
    }

});

mongoose.model("Request", requestSchema);