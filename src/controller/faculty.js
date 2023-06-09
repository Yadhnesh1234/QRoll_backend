const Faculty=require('../models/faculty.js')
const bcrypt = require('bcrypt');
const Subject = require('../models/subject')
const jwt=require('jsonwebtoken')
const nodemailer = require("nodemailer");
const SECRET_KEY="USER_SIGNIN"
const getFacultyDetails=async (req,res,next)=>{
   var data;
   try{
    data=await Faculty.find({})
    .populate('timeTable.schedule.subject','subject')
    .populate('timeTable.schedule.classroom','name')
    // .populate({
    //   path:'timeTable',
    //   populate: [
    //     {
    //       path: 'schedule',
    //       populate:[
    //         'subject',
    //         'classroom'
    //       ]
    //     }
    //   ]
    // })
   }catch(err){
    next(err)
   }
   if(!data){
    return res.status(500).json({message:"Internal server error"})
   }
   return res.status(200).json({status:"Success",data})
}
const getTodaysTimetable=async(req,res,next)=>{
     const id=req.userId
     var {day}=req.body;
     let user
     try{
     user= await Faculty.findById(id)
     .populate('timeTable.schedule.subject','subject')
     .populate('timeTable.schedule.classroom','name')
    //  .populate({
    //   path:'timeTable',
    //   populate: [
    //     {
    //       path: 'schedule',
    //       populate:[
    //         'subject',
    //         'classroom'
    //       ]
    //     }
    //   ]
    // })

   
     schedule=user.timeTable
     var data=schedule.filter((val)=>{
        return val.day==day? val: false
     })
    
    if(data!=false){
      data=data[0]

      return res.status(200).json({status:"Success",data})
    }else{
      return res.status(500).json({message:"Internal server error"})
    }
     }catch(err){
       return next(err) 
     }
     
}
const saveFacultyDetails=async (req,res,next)=>{
    var {name,email,dept,mobNo,password}=req.body;
    var data
    try{
     password=await bcrypt.hash(password, 10)
     data=new Faculty({
      name,email,dept,mobNo,password
     })
     data=data.save();
    }catch(err){
     next(err)
    }
    if(!data){
     return res.status(500).json({message:"Internal server error"})
    }
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
   let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lavada.rolfson@ethereal.email',
      pass: 'Q9Yu5nh2hDdruKz7Wd'
    },
  });

  let info = await transporter.sendMail({
    from: '"Yadhnesh Gangurde" <gangurdeyadhnesh28@gmail.com>', // sender address
    to: email ,// list of receivers
    subject: "About successful Registration", // Subject line
    text: "Hello faculty,", // plain text body
    html: "<b>Your Regsitration request sent to admin successfully!!!!</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


    return res.status(200).json({status:"Data Saved Successfully"})
 }
const setTimeTable=async (req,res,next)=>{
    var id=req.userId
    var {timeTable}=req.body;
    let user
    try{
    user= await Faculty.findByIdAndUpdate(id,{timeTable})
    }catch(err){
       return next(err) 
    }
    if(!user)
    return res.status(500).json({message:"Internal server error"})

    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
   let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'lavada.rolfson@ethereal.email',
      pass: 'Q9Yu5nh2hDdruKz7Wd'
    },
  });

  let info = await transporter.sendMail({
    from: '"Yadhnesh Gangurde" <gangurdeyadhnesh28@gmail.com>', // sender address
    to: user.email, // list of receivers
    subject: "About Timetable set", // Subject line
    text: "Hello faculty,", // plain text body
    html: "<b>Your TimeTable is set by admin!!!</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));


    return res.status(200).json({msg:"Time table set sucessfully"})  

}

const getfacultydetail=async(req,res,next)=>{
  const id=req.userId
  var faculty;
  try{
      faculty=await Faculty.findById(id).populate({
        path:'timeTable',
        populate: [
          {
            path: 'schedule',
            populate:[
              'subject',
              'classroom'
            ]
          }
        ]
      })
  }catch(err){
    next(err)
  }
  if(!faculty)
    return res.status(500).json({message:"Internal server error"})
  return res.status(200).json({msg:"Success",faculty})  
}
const facultylogin=async(req,res,next)=>{
     var {email,password}=req.body
    //  username=username.trim()
    //  password=password.trim()
     var data;
     try{
      data=await Faculty.findOne({email})
      console.log(data)
      if(!data)
        return  res.status(404).send('User not found!! Check the username again');
      const passwordMatch = await bcrypt.compare(password,data.password);
      if(!passwordMatch)
        return  res.status(404).json({msg:'Invalid Password'});
      const token=jwt.sign({email:data.email,userId:data._id},SECRET_KEY)
      return res.status(200).json({status:"Login Successful",data,token})
     }catch(err){
      next(err)
     }
}
const deleteFaculty=async (req,res,next)=>{
  const id=req.userId
  let user
  try{
    user= await Faculty.findByIdAndRemove(id)
  }catch(err){
     return err(next)
  }
  if(!user)
  return res.status(500).json({message:"Internal server error"})

  return res.status(200).json({msg:"Deleted suucessfully"})
}
module.exports={
    getFacultyDetails,
    saveFacultyDetails,
    facultylogin,
    setTimeTable,
    getfacultydetail,
    getTodaysTimetable,
    deleteFaculty
}