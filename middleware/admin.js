model.export = function teacher(req,res,next){
    const {cookies} = req;
    if(!cookies.jwtToken){
        return res.status(401).json({error:"You must be signed in"})

    }
    else{
        const token = cookies.jwtToken.replace("Bearer ","")
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(error, user)=>{
            if(error){
                return res.status(401).json({error: "You must be signed in"})
            }
            var obj = user
            if (obj.role == "ADMIN"){
                req.user = obj;
                next();
            }
            else{
                res.send("You are not a teacher")
            }
        });
    }
}