/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source.
* 
*  Name: ______________________ Student ID: ______________ Date: ________________
*
*  Online (Vercel) Link: ________________________________________________________
*
********************************************************************************/ 

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData.js");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Middleware to track active routes
app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    next();
});

// ✅ FIXED: Correctly passing `content` to render pages
app.get("/", (req, res) => res.render("home", { content: "home.ejs" }));
app.get("/about", (req, res) => res.render("about", { content: "about.ejs" }));
app.get("/htmlDemo", (req, res) => res.render("htmlDemo", { content: "htmlDemo.ejs" }));
app.get("/students/add", (req, res) => res.render("addStudent", { content: "addStudent.ejs" }));

// ✅ Students List
app.get("/students", (req, res) => {
    collegeData.getAllStudents()
        .then(data => res.render("students", { students: data, content: "students.ejs" }))
        .catch(() => res.render("students", { message: "No results", content: "students.ejs" }));
});



// ✅ Courses List
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(data => res.render("courses", { courses: data })) // ✅ Removed content variable
        .catch(() => res.render("courses", { message: "No courses found" }));
});




// ✅ Single Student Profile
app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.render("student", { student: data, content: "student.ejs" }))
        .catch(() => res.render("student", { message: "Student not found", content: "student.ejs" }));
});

// ✅ Update Student
app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(err => res.status(500).send(err));
});

// ✅ 404 Error handling
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// ✅ Start the server
collegeData.initialize().then(() => {
    app.listen(HTTP_PORT, () => console.log(`Server running at http://localhost:${HTTP_PORT}`));
}).catch(err => console.log(`Failed to initialize: ${err}`));
