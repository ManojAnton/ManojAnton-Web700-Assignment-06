/*********************************************************************************
*  WEB700 – Assignment 6
*
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
*
*  Name: Manoj Anton Manorathan Student ID: 146165238 Date: April 4, 2025
*
********************************************************************************/

const express = require("express");
const path = require("path");
const collegeData = require("./modules/collegeData");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/main");

app.use(async (req, res, next) => {
    try {
        await collegeData.initialize();
        next();
    } catch (err) {
        console.error(`Initialization error: ${err}`);
        res.status(500).send(`Server error: ${err}`);
    }
});

app.get("/", (req, res) => res.render("home"));
app.get("/about", (req, res) => res.render("about"));
app.get("/htmlDemo", (req, res) => res.render("htmlDemo"));

app.get("/students/add", (req, res) => {
    collegeData.getCourses()
        .then(courses => res.render("addStudent", { courses }))
        .catch(() => res.render("addStudent", { courses: [] }));
});

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(err => res.status(500).send("Error adding student: " + err));
});

app.get("/students", (req, res) => {
    const course = req.query.course;
    const fetch = course ? collegeData.getStudentsByCourse(course) : collegeData.getAllStudents();

    fetch.then(data => res.render("students", { students: data }))
         .catch(err => res.render("students", { message: err }));
});

app.get("/student/:num", (req, res) => {
    let viewData = {};

    collegeData.getStudentByNum(req.params.num)
        .then(student => {
            if (!student) throw "Student Not Found";
            viewData.student = student;
            return collegeData.getCourses();
        })
        .then(courses => {
            viewData.courses = courses;
            for (let i = 0; i < courses.length; i++) {
                if (courses[i].courseId == viewData.student.course) {
                    courses[i].selected = true;
                }
            }
            res.render("student", { viewData });
        })
        .catch(err => res.render("student", { message: err }));
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(err => res.status(500).send(err));
});

app.get("/student/delete/:studentNum", (req, res) => {
    collegeData.deleteStudentByNum(req.params.studentNum)
        .then(() => res.redirect("/students"))
        .catch(err => res.status(500).send("Unable to Remove Student / Student not found"));
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(data => res.render("courses", { courses: data }))
        .catch(err => res.render("courses", { message: err }));
});

app.get("/courses/add", (req, res) => res.render("addCourse"));

app.post("/courses/add", (req, res) => {
    collegeData.addCourse(req.body)
        .then(() => res.redirect("/courses"))
        .catch(err => res.status(500).send("Error adding course: " + err));
});

app.post("/course/update", (req, res) => {
    collegeData.updateCourse(req.body)
        .then(() => res.redirect("/courses"))
        .catch(err => res.status(500).send(err));
});

app.get("/course/delete/:id", (req, res) => {
    collegeData.deleteCourseById(req.params.id)
        .then(() => res.redirect("/courses"))
        .catch(err => res.status(500).send("Unable to Remove Course / Course not found"));
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

if (process.env.VERCEL) {
    module.exports = app;
} else {
    app.listen(HTTP_PORT, () => console.log(`Server running at http://localhost:${HTTP_PORT}`));
}
