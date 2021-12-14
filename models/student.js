const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true
        
    },
    gender:{
        type:String,
        required: true,
        trim: true,
        
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
    password:{
        type: String,
        required: true,
    },
    mobNo:{
        type: Number,
        required: true,
       
    },
    grouped:{
        type: String,
        default: "false"
    }
   
},
{timestamps: true}
);
mongoose.model("Student", studentSchema);