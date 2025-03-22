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
app.get("/students/add", (req, res) => res.render("addStudent"));

app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(err => res.status(500).send("Error adding student: " + err));
});

app.get("/students", (req, res) => {
    collegeData.getAllStudents()
        .then(data => {
            console.log("Students data:", data);
            res.render("students", { students: data });
        })
        .catch(err => res.render("students", { message: err }));
});

app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then(data => {
            console.log("Courses data:", data);
            res.render("courses", { courses: data });
        })
        .catch(err => res.render("courses", { message: err }));
});

app.get("/student/:num", (req, res) => {
    collegeData.getStudentByNum(req.params.num)
        .then(data => res.render("student", { student: data }))
        .catch(err => res.render("student", { message: err }));
});

app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(err => res.status(500).send(err));
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

if (process.env.VERCEL) {
    module.exports = app;
} else {
    app.listen(HTTP_PORT, () => console.log(`Server running at http://localhost:${HTTP_PORT}`));
}