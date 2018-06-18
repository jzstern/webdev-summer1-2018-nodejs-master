module.exports = function (app) {

  app.post('/api/course/:courseId/section', createSection);
  app.post('/api/section/:sectionId/enrollment', enrollStudentInSection);
  app.get('/api/course/:courseId/section', findSectionsForCourse);
  app.get('/api/student/section', findSectionsForStudent);
	app.delete('/api/section/:sectionId/enrollment/:enrollmentId', unenrollStudentInSection);
	app.delete('/api/section/:sectionId', deleteSection);

  var sectionModel = require('../models/section/section.model.server');
  var enrollmentModel = require('../models/enrollment/enrollment.model.server');

  function findSectionsForStudent(req, res) {
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    enrollmentModel
      .findSectionsForStudent(studentId)
      .then(function(enrollments) {
        res.json(enrollments);
      });
  }

  function enrollStudentInSection(req, res) {
    var sectionId = req.params.sectionId;
    var currentUser = req.session.currentUser;
    var studentId = currentUser._id;
    var enrollment = {
      student: studentId,
      section: sectionId
    };

    sectionModel
      .decrementSectionSeats(sectionId)
      .then(function () {
        return enrollmentModel
          .enrollStudentInSection(enrollment)
      })
      .then(function (enrollment) {
        res.json(enrollment);
      })
  }

  function unenrollStudentInSection(req, res) {
	  var sectionId = req.params.sectionId;
	  var enrollmentId = req.params.enrollmentId;

    enrollmentModel
		  .unenrollStudentInSection(enrollmentId)
		  .then(function() {
		    sectionModel
				  .incrementSectionSeats(sectionId)
				  .then(function() {
				    res.sendStatus(200);
				  })
		  });
  }

  function findSectionsForCourse(req, res) {
    var courseId = req.params['courseId'];
    sectionModel
      .findSectionsForCourse(courseId)
      .then(function (sections) {
        res.json(sections);
      })
  }

  function createSection(req, res) {
    var section = req.body;
    sectionModel
      .createSection(section)
      .then(function (section) {
        res.json(section);
      })
  }

  function deleteSection(req, res) {
  	var sectionId = req.params.sectionId;
  	sectionModel
		  .deleteSection(sectionId);
  }
};