const Student=require('../models/student')
const Classroom=require('../models/classroom')
const Semister=require('../models/semister')
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const SECRET_KEY="USER_SIGNIN"
const getStudDetails=async (req,res,next)=>{
   var data;
   try{
    data=await Student.find({}).populate('classroom','name').populate('semister','semNo subjects')
   }catch(err){
    next(err)
   }
   if(!data){
    return res.status(500).json({message:"Internal server error"})
   }
   return res.status(200).json({status:"Success",data})
}

const saveStudDetails=async (req,res,next)=>{
    var {name,department,semister,classroom,mobileNum,rollNo,email,password}=req.body;
    var data
    try{
     var userExist=await Student.findOne({email})
     if(userExist)
        return  res.status(400).json({msg:'UserName Already Exist'});

     classroom=(classroom.toUpperCase()).trim()
     classroom=await Classroom.findOne({name:classroom});
     semister=await Semister.findOne({semNo:semister});
     classroom=classroom._id
     semister=semister._id
     console.log(classroom)
     console.log(semister)
     password=await bcrypt.hash(password, 10)
     data=new Student({
      name,department,semister,classroom,mobileNum,rollNo,email,password
     })
     data=data.save();
    }catch(err){
     next(err)
    }
    if(!data){
     return res.status(500).json({message:"Internal server error"})
    }
 }

 const findStudent=async(req,res,next)=>{
    const id=req.userId
    var data;
    try{
     data=await Student.findById(id)
    }catch(err){
     next(err)
    }
    if(!data){
     return res.status(404).json({message:"Student Not Found "})
    }
    return res.status(200).json({status:"Success",data})  

 }
 const updateStudDetails=async(req,res,next)=>{
    const id=req.userId
    var {name,department,semister,classroom,mobileNum,rollNo,email,password} =req.body;
    let user
    classroom=classroom.toUpperCase().trim()
    classroom=await Classroom.findOne({name:classroom});
    semister=await Semister.findOne({semNo:semister});
    classroom=classroom._id
    semister=semister._id
    password=await bcrypt.hash(password, 10)
    try{
      user= await Student.findByIdAndUpdate(id,{name,department,semister,classroom,mobileNum,rollNo,email,password})
    }catch(err){
       return next(err) 
    }
    if(!user)
    return res.status(500).json({message:"Internal server error"})

    return res.status(200).json({msg:"updated suucessfully"})  
 }
 
 const deleteStudent=async (req,res,next)=>{
   const id=req.userId
    let user
    try{
      user= await Student.findByIdAndRemove(id)
    }catch(err){
       return err(next)
    }
    if(!user)
    return res.status(500).json({message:"Internal server error"})

    return res.status(200).json({msg:"Deleted suucessfully"})
}

 const studentlogin= async (req,res,next)=>{
    var {email,password}=req.body
  //  username=username.trim()
  password=password.trim()
   var existingUser;
   try{
      existingUser=await Student.findOne({email})
    if(!existingUser)
      return  res.status(404).send('User not found!! Check the username again');
    const passwordMatch = await bcrypt.compare(password,existingUser.password);
    if(!passwordMatch)
      return  res.status(404).json({msg:'Invalid Password'});
   const token=jwt.sign({email:existingUser.email,userId:existingUser._id},SECRET_KEY)
   return res.status(200).json({status:"Login Successful",existingUser,token})
   }catch(err){
    next(err)
   }
} 

module.exports={
    getStudDetails,
    saveStudDetails,
    updateStudDetails,
    findStudent,
    studentlogin,
    deleteStudent
}