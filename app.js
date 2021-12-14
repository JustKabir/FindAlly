const express = require('express');
const app = express();
const Port = 8000;
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
// const bodyParser = require('body-parser');
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
const hbs = require('hbs');
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

function signin(req, res, next){
  const {cookies} = req;
  if(!cookies){
      return res.status(401).json({error:"You must be signed in"})

  }

  const token = cookies.jwtToken.replace("Bearer ","")
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(error,user)=>{
      if(error){
          return res.status(401).json({error: "You must be signed in"})
      }
      req.user = user;
      console.log(user)
      next();
  });
}


// Index
app.get('/', (req, res)=>{
  res.render("index");
});

// -----------------STUDENT-------------------------
// Student Login
app.get('/student/login', (req, res)=>{
  res.render('studentLogin.hbs');
});

app.post('/student/login', async(req, res)=>{
  try{
    const student = await Student.findOne({email: req.body.email});
    if(student.email == req.body.email){
        if( req.body.password == student.password){
            const user = student.toJSON();
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); 
            res.cookie('jwtToken',accessToken).redirect('/student/home');
        }
        else{
            res.send("password and email dont match");
        }
    }
    else{
        res.send("email and password dont match")
    } 
} catch (err){
    console.log(err);
}
});

app.get('/student/groups', signin, async (req,res)=>{
  try{
    const groups = await Group.find({leaderId: req.user._id});
    const user = req.user;
    res.render('studentGroups', {groups, user});
  }catch(err){
    console.log(err);
  }
});

// app.get('/student/:userId', signin, async(req, res)=>{
//   try{
    
//     const id = req.params['userId'];
//     console.log(id)
//     // const user = await Student.findById(id);
//   }catch(err){
  //     console.log(err);
  //   }
  
  // });
  
  app.get('/student/profile/:userId', signin, async(req,res)=>{
    try{
      const userId = req.params['userId'];
      const student = await Student.findOne({_id: userId});
      const user = req.user;
      console.log(student);
          res.render('studentProfile', {student, user});
    }catch(err){
      console.log(err)
    }
});

app.get('/student/home',signin, async(req,res)=>{
  try{
    const assignments = await Assignment.find({$and:[{year: req.user.year},{branch: req.user.branch}]})
    .sort([['createdAt', -1]]);
    // const notifications = await Assignment.find({$and:[{year: req.user.year},{branch: req.user.branch}]})
    // .sort([['createdAt', -1]])
    const user = req.user
    const notifications = await Request.find({$and:[{memberId: user._id},{decision:0}]}).limit(4);
    // .limit(4);
    // const Projects = await PersonalProject.find().sort([['createdAt',-1]]);
    // console.log(assignments);
    // console.log(Projects);
    console.log(notifications);
    console.log(user)
    res.render('studentHome', {assignments, user, notifications});
    // res.render('student/home', {assignments});
} catch(err){
    console.log(err);
}
});

app.get('/student/assignment/:assId', signin,async(req,res)=>{
  try{

    const assignment = await Assignment.findOne({_id: req.params['assId']});
    const classmates = await Student.find({$and:[{year:req.user.year}, {branch: req.user.branch}]})
    const groups = await Group.find({assignmentId: req.params['assId']})
    console.log(assignment);
    // console.log(groups);
    const user = req.user
    res.render('assignment', {assignment, classmates, groups, user});
} catch(err){
    console.log(err);
}
});

// ----------------------------------------GROUP---------------------------------------------
app.get('/student/assignment/:assId/create-group', signin, (req ,res)=>{
    const assignmentId = req.params['assId'];
    const user = req.user;
    res.render('createGroup', {assignmentId, user});
});

app.post('/student/assignment/:assId/create-group', signin, async(req ,res)=>{
  try{
    const id  = req.params['assId'];
    const assignment = await Assignment.findById(id);
    console.log(assignment)

    const group = new Group({
        name: req.body.name,
        topic: req.body.topic,
        leader: req.user.name,
        leaderId: req.user._id,
        year: req.user.year,
        branch: req.user.branch,
        description: req.body.description,
        githubLink: req.body.githubLink,
        teamLimit: assignment.maxTeammateCount,
        assignmentId: assignment._id,  
    });
    group.save();
}catch(err){
    console.log(err);   
}

res.send("Event");
});

app.get('/group/:grpId', signin, async(req,res)=>{
  try{

    const id = req.params['grpId']
    const group = await Group.findById(id);
    const classmates = await Student.find({$and:[{year:req.user.year}, {branch: req.user.branch}]})
    // console.log(group)
    const user = req.user;
    const l = group.teammates
    const len = l.length
    // console.log(l.length)
    res.render('group', {group, classmates, user, len})
  }catch(err){
    console.log(err);
  }
});

app.post('/group/add/desc/:member', signin,async(req,res)=>{
  const memberId = req.params['member'];
  // const member = await Student.findById(memberId);
  const groupId = await Group.findOne({leaderId: req.user._id});
  const request = new Request({
    groupId: groupId._id,
    memberId: memberId,
    name: groupId.name
  });
  request.save();
  res.redirect('/student/home')

  
})

app.post('/group/add/:member', signin, async(req,res)=>{
  const memberId = req.params['member'];
  const member = await Student.findById(memberId);
  const groupId = await Group.findOne({leaderId: req.user._id});
  const newMember = Group.findOneAndUpdate({id_: groupId._id},{
    $push:{teammates:{name: member.name, memId: memberId}}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      console.log(err);
    }
    else{

      res.redirect('/')
    }
  })
  const st = student.findOneAndUpdate({id_: member._id},{
    $set:{grouped: "true"}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      console.log(err);
    }
    else{

      res.redirect('/')
    }
  })

  // console.log(groupId);
});

// ---------------------------TEACHER---------------------------
app.get('/teacher/login', (req,res)=>{
  res.render('teacherLogin');
});
app.post('/teacher/login', async(req,res)=>{
  try{
    const teacher = await Teacher.findOne({email: req.body.email});
    // console.log(student)
    if(teacher.email == req.body.email){
        if( req.body.password == teacher.password){
            const user = teacher.toJSON();
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); 
            res.cookie('jwtToken',accessToken).redirect('/teacher/home');
        }
        else{
            res.send("password and email dont match");
        }
    }
    else{
        res.send("email and password dont match")
    } 
} catch (err){
    console.log(err);
}
  // res.render('teacherLogin');
});

app.get('/teacher/home', (req,res)=>{
  res.render('teacherHome');
});

app.get('/teacher/create/assignment', (req,res)=>{
  res.render('createAssignment');
});

app.post('/teacher/create/assignment', signin,(req,res)=>{
  try{

    // console.log(req.body.title)
    const assignment = new Assignment({
        title: req.body.title,
        host: req.user.name,
        year: req.body.year,
        branch: req.body.branch,
        description: req.body.description,
        role: req.user.role,
        hostId: req.user._id,
        teamEntryDate: req.body.teamEntryDate,
        projSubDate: req.body.projSubDate

    });
    assignment.save();
}catch(err){
    console.log(err);   
}

res.send("Event");
});

// -----------------------ADMIN-------------------------
app.get('/admin', signin,(req, res)=>{
  const user = req.user
  res.render('adminIndex', {user});
});

// Login
app.get('/admin/login', (req,res)=>{
  res.render('adminLogin');
});
app.post('/admin/login', async(req,res)=>{
  try{
    const admin = await Teacher.findOne({email: req.body.email});
    // console.log(student)
    if(admin.email == req.body.email && admin.role == "ADMIN"){
        if( req.body.password == admin.password){
            const user = admin.toJSON();
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); 
            res.cookie('jwtToken',accessToken).redirect('/admin');
        }
        else{
            res.send("password and email dont match");
        }
    }
    else{
        res.send("email and password dont match")
    } 
} catch (err){
    console.log(err);
}
});

// STUDENTS
app.post('/admin/register/students',(req,res)=>{
  
  if(req.files){
    const file = req.files.student
    const filename = file.name
    console.log(filename);
    file.mv('C:/Users/Kabir/Desktop/findAlly/uploads/students'+filename);
    // D:/KabirProject/FindAlly/uploads/students
    const path = `C:/Users/Kabir/Desktop/findAlly/uploads/students${filename}`
    csv()
    .fromFile(path)
    .then(((jsonObj)=>{
        jsonObj.map((item)=>{
           
            const student = new Student({
                name: item.name,
                email: item.email,
                year: item.year,
                branch: item.branch,
                gender: item.gender,
                mobNo: item.mobNo,
                password: "password",
                role: "STUDENT"
            });
            student.save()
            .then((user)=>{
                console.log(user);
            })
            .catch(error=>{
                console.log(error)
            })
            

        });
        console.log("Kakakshi")
    }));

    res.redirect("/admin")
}
else{
    res.send("crash")
}
});

// Teachers
app.post('/admin/register/teachers', (req,res)=>{
  console.log(req.files);
  if(req.files){
    const file = req.files.teacher
    const filename = file.name
    file.mv('C:/Users/Kabir/Desktop/findAlly/uploads/teachers'+filename);
    const path = `C:/Users/Kabir/Desktop/findAlly/uploads/teachers${filename}`
    csv()
    .fromFile(path)
    .then(((jsonObj)=>{
        jsonObj.map((item)=>{
           
            const teacher = new Teacher({
                name: item.name,
                email: item.email,
                role: "TEACHER",
                gender: item.gender,
                mobNo: item.mobNo,
                password: "password"
            });
            teacher.save()
            .then((user)=>{
                console.log(user);
            })
            .catch(error=>{
                console.log(error)
            })
            

        });
        console.log("Kakakshi")
    }));

    res.redirect("/admin")
}
else{
    res.send("crash")
}
});


  

// Server Init
app.listen(Port,()=>{
    console.log(`Server is running on ${Port}`)
});            