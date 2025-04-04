const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("neondb", "neondb_owner", "npg_BwTDsi17GMxH", {
  host: "ep-wandering-wave-a4mq7bmx-pooler.us-east-1.aws.neon.tech",
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
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
  return sequelize.sync();
};

module.exports.getAllStudents = function () {
  return Student.findAll();
};

module.exports.getStudentsByCourse = function (course) {
  return Student.findAll({ where: { course } });
};

module.exports.getStudentByNum = function (num) {
  return Student.findByPk(num);
};

module.exports.addStudent = function (studentData) {
  return Student.create(studentData);
};

module.exports.updateStudent = function (studentData) {
  return Student.update(studentData, {
    where: { studentNum: studentData.studentNum }
  });
};

module.exports.getCourses = function () {
  return Course.findAll();
};

module.exports.getCourseById = function (id) {
  return Course.findByPk(id);
};

module.exports.addCourse = function (courseData) {
  return Course.create(courseData);
};

module.exports.updateCourse = function (courseData) {
  return Course.update(courseData, {
    where: { courseId: courseData.courseId }
  });
};

module.exports.deleteCourseById = function (id) {
  return Course.destroy({ where: { courseId: id } });
};

module.exports.deleteStudentByNum = function (num) {
  return Student.destroy({ where: { studentNum: num } });
};
