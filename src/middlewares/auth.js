const jwt=require('jsonwebtoken')
const SECRET_KEY="USER_SIGNIN"
const auth=(req,res,next)=>{
    try{
      const token=req.headers.authorization
      if(token){
         console.log(token.split(" ")[1])
         let user=jwt.verify(token.split(" ")[1],SECRET_KEY)
         console.log(user)
         req.userId=user.userId
         next();
      }
     
    }catch(err){
          res.status(401).json({msg:"Unauthorize access denied"})
    }
    
}

module.exports={auth}