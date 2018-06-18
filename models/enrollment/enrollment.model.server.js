var mongoose = require('mongoose');
var enrollmentSchema = require('./enrollment.schema.server');
var enrollmentModel = mongoose.model(
  'EnrollmentModel',
  enrollmentSchema
);

function enrollStudentInSection(enrollment) {
  return enrollmentModel.create(enrollment);
}

function findEnrollmentById(enrollmentId) {
	return enrollmentModel.findById(enrollmentId);
}

function unenrollStudentInSection(enrollmentId) {
  return enrollmentModel.remove({_id: enrollmentId});
}

function findSectionsForStudent(studentId) {
  return enrollmentModel
    .find({student: studentId})
    .populate('section')
    .exec();
}

module.exports = {
  enrollStudentInSection: enrollStudentInSection,
	unenrollStudentInSection: unenrollStudentInSection,
  findSectionsForStudent: findSectionsForStudent,
	findEnrollmentById: findEnrollmentById
};