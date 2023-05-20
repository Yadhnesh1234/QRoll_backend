const express=require('express')
const {getFacultyDetails,saveFacultyDetails,facultylogin,setTimeTable,getfacultydetail,getTodaysTimetable,deleteFaculty}=require('../controller/faculty')
const {auth}=require('../middlewares/auth')
const router=express.Router();

router.get("/getfacultydetails",getFacultyDetails)
router.get("/gettodaystimetable",auth,getTodaysTimetable)
router.get("/get-faculty-detail",auth,getfacultydetail)
router.post("/savefacultydetails",saveFacultyDetails)
router.post("/facultylogin",facultylogin)
router.put("/setfacultytimetable",auth,setTimeTable)
router.delete("/deletefaculty",deleteFaculty)
module.exports=router