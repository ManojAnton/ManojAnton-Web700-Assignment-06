const fs = require("fs");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/courses.json", "utf8", (err, courseData) => {
            if (err) reject("Unable to load courses");

            fs.readFile("./data/students.json", "utf8", (err, studentData) => {
                if (err) reject("Unable to load students");

                dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                resolve();
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length === 0) reject("No students found");
        resolve(dataCollection.students);
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length === 0) {
            reject("no results returned");
        } else {
            resolve(dataCollection.courses.map(course => ({
                courseId: course.courseId,
                courseCode: course.courseCode,
                courseDescription: course.courseDescription
            })));
        }
    });
};

module.exports.getStudentByNum = function (num) {
    return new Promise((resolve, reject) => {
        const foundStudent = dataCollection.students.find(student => student.studentNum == num);
        if (!foundStudent) reject("Student not found");
        resolve(foundStudent);
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        let foundIndex = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);
        if (foundIndex !== -1) {
            dataCollection.students[foundIndex] = studentData;
            resolve();
        } else {
            reject("Student not found");
        }
    });
};
