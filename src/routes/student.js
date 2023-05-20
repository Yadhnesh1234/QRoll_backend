const express=require('express')
const{
    getStudDetails,
    saveStudDetails,
    updateStudDetails,
    findStudent,
    studentlogin,
    deleteStudent
}=require('../controller/student')
const {auth} =require('../middlewares/auth')
const router=express.Router();

router.get("/getstuddetails", getStudDetails)
router.get("/findstudent",auth,findStudent)
router.post("/savestuddetails",saveStudDetails)
router.post("/studentlogin",studentlogin)
router.put("/updatestuddetails",auth,updateStudDetails)
router.delete("/deletestudent",auth,deleteStudent)
module.exports=router