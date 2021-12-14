const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    githubLink:{
        type: String,
    },
    skills:[],
    bio:{
        type: String,
        trim: true
    },
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }

});

module.exports = mongoose.model('Group', profileSchema);