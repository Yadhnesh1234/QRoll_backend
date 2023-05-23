const express=require('express')
const { 
    getClassAttendance,
    getStudentAttendance,
    totalLectureOfSubject,
    getUpdatedListOfStudents
}=require('../controller/attendance')

const router=express.Router()
router.post("/get-class-attendance",getClassAttendance)
router.post("/get-student-attendance",getStudentAttendance)
router.post("/get-lecture-details",totalLectureOfSubject)
router.post("/get-updated-studentList",getUpdatedListOfStudents)
module.exports=router