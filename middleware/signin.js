module.exports = function signin(req, res, next){
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