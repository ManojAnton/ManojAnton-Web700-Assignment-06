const fs = require("fs");
const path = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        const coursesFilePath = path.join(__dirname, "data", "courses.json");
        const studentsFilePath = path.join(__dirname, "data", "students.json");

        console.log("Initializing...");
        console.log("Courses file path:", coursesFilePath);
        console.log("Students file path:", studentsFilePath);

        fs.readFile(coursesFilePath, "utf8", (err, courseData) => {
            if (err) {
                console.error(`Error reading courses file at ${coursesFilePath}: ${err.message}`);
                return reject("Unable to load courses");
            }

            fs.readFile(studentsFilePath, "utf8", (err, studentData) => {
                if (err) {
                    console.error(`Error reading students file at ${studentsFilePath}: ${err.message}`);
                    return reject("Unable to load students");
                }

                try {
                    dataCollection = new Data(JSON.parse(studentData), JSON.parse(courseData));
                    console.log("Data initialized successfully");
                    resolve();
                } catch (parseErr) {
                    console.error(`Error parsing JSON: ${parseErr.message}`);
                    reject("Invalid JSON format in data files");
                }
            });
        });
    });
};

module.exports.getAllStudents = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.students.length === 0) {
            reject("No students found");
        } else {
            resolve(dataCollection.students);
        }
    });
};

module.exports.getCourses = function () {
    return new Promise((resolve, reject) => {
        if (!dataCollection || dataCollection.courses.length === 0) {
            reject("No courses found");
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
        if (!dataCollection) {
            reject("Data not initialized");
        } else {
            const foundStudent = dataCollection.students.find(student => student.studentNum == num);
            if (!foundStudent) reject("Student not found");
            else resolve(foundStudent);
        }
    });
};

module.exports.updateStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
        } else {
            let foundIndex = dataCollection.students.findIndex(student => student.studentNum == studentData.studentNum);
            if (foundIndex !== -1) {
                dataCollection.students[foundIndex] = studentData;
                resolve();
            } else {
                reject("Student not found");
            }
        }
    });
};

module.exports.addStudent = function (studentData) {
    return new Promise((resolve, reject) => {
        if (!dataCollection) {
            reject("Data not initialized");
        } else {
            studentData.studentNum = String(studentData.studentNum);
            dataCollection.students.push(studentData);
            resolve();
        }
    });
};