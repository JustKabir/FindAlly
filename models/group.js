const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: true,
        trim: true,

    },
    topic:{
        type: String,
        required: true,
        trim: true,

    },
    leader:{
        type: String,
        required: true,
    },
    leaderId:{
        type:String,
        required: true
    },
    year:{
        type: String,
        required: true,
        trim: true,

    },
    branch:{
        type: String,
        required: true,
        trim: true,
    },
    description:{
        type:String,
        required: true,
        trim:true
    },
    status:{
        type: String,
        default: "ACTIVE",
        required: true
    },
    githubLink:{
        type: String,
        trim: true
    },
    teamLimit:{
        type: Number,
        trim: true,
        required: true
    },
    assignmentId:{
        type: mongoose.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    teammates:[{
        name:{
            type: String
        },
        memId: {
            type: String
        }
    }],
    skills:[{
        skill:{
            type:String
        }
    }]
    
},
{timestamps:true}

);

module.exports = mongoose.model('Group', groupSchema);