const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("neondb", "neondb_owner", "npg_BwTDsi17GMxH", {
  host: "ep-wandering-wave-a4mq7bmx-pooler.us-east-1.aws.neon.tech",
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
});

const Student = sequelize.define("Student", {
  studentNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  addressStreet: DataTypes.STRING,
  addressCity: DataTypes.STRING,
  addressProvince: DataTypes.STRING,
  TA: DataTypes.BOOLEAN,
  status: DataTypes.STRING
});

const Course = sequelize.define("Course", {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseCode: DataTypes.STRING,
  courseDescription: DataTypes.STRING
});

Course.hasMany(Student, { foreignKey: "course" });

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync()
      .then(() => resolve())
      .catch(() => reject("unable to sync the database"));
  });
};

module.exports.getAllStudents = function () {
  return new Promise((resolve, reject) => {
    Student.findAll()
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getStudentsByCourse = function (course) {
  return new Promise((resolve, reject) => {
    Student.findAll({ where: { course } })
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.findAll({ where: { studentNum: num } })
      .then(data => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getCourses = function () {
  return new Promise((resolve, reject) => {
    Course.findAll()
      .then(data => resolve(data))
      .catch(() => reject("no results returned"));
  });
};

module.exports.getCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.findAll({ where: { courseId: id } })
      .then(data => resolve(data[0]))
      .catch(() => reject("no results returned"));
  });
};

module.exports.addStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;
    for (let prop in studentData) {
      if (studentData[prop] === "") studentData[prop] = null;
    }
    Student.create(studentData)
      .then(() => resolve())
      .catch(() => reject("unable to create student"));
  });
};

module.exports.updateStudent = function (studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = studentData.TA ? true : false;
    for (let prop in studentData) {
      if (studentData[prop] === "") studentData[prop] = null;
    }
    Student.update(studentData, { where: { studentNum: studentData.studentNum } })
      .then(() => resolve())
      .catch(() => reject("unable to update student"));
  });
};

module.exports.addCourse = function (courseData) {
  return new Promise((resolve, reject) => {
    for (let prop in courseData) {
      if (courseData[prop] === "") courseData[prop] = null;
    }
    Course.create(courseData)
      .then(() => resolve())
      .catch(() => reject("unable to create course"));
  });
};

module.exports.updateCourse = function (courseData) {
  return new Promise((resolve, reject) => {
    for (let prop in courseData) {
      if (courseData[prop] === "") courseData[prop] = null;
    }
    Course.update(courseData, { where: { courseId: courseData.courseId } })
      .then(() => resolve())
      .catch(() => reject("unable to update course"));
  });
};

module.exports.deleteCourseById = function (id) {
  return new Promise((resolve, reject) => {
    Course.destroy({ where: { courseId: id } })
      .then(() => resolve())
      .catch(() => reject("unable to delete course"));
  });
};

module.exports.deleteStudentByNum = function (num) {
  return new Promise((resolve, reject) => {
    Student.destroy({ where: { studentNum: num } })
      .then(() => resolve())
      .catch(() => reject("unable to delete student"));
  });
};