module.exports = function (app) {
  app.get('/api/user', findAllUsers);
  app.get('/api/user/:userId', findUserById);
  app.post('/api/user', createUser);
	app.put('/api/user/:userId', updateUser);
  app.get('/api/profile', profile);
	app.get('/api/admin', isAdmin);
	app.get('/api/login/profile', getUser);
  app.post('/api/logout', logout);
  app.post('/api/login', login);

  var userModel = require('../models/user/user.model.server');

  function login(req, res) {
    var credentials = req.body;
    userModel
      .findUserByCredentials(credentials)
      .then(function(user) {
        if (user) {
          req.session['currentUser'] = user;
          res.json(user);
        } else {
          res.sendStatus(404);
        }
      })
  }

  function logout(req, res) {
    req.session.destroy();
    res.sendStatus(200);
  }

  function findUserById(req, res) {
    var id = req.params['userId'];
    userModel.findUserById(id)
      .then(function (user) {
        res.json(user);
      })
  }

  function profile(req, res) {
    res.json(req.session['currentUser']);
  }

  function createUser(req, res) {
    var user = req.body;

    userModel
      .findUserByUsername(user.username)
      .then(function(response) {
	      if (response === null) {
		      return userModel
			      .createUser(user)
			      .then(function (user) {
			        console.log(user);
				      req.session['currentUser'] = user;
				      res.json(user);
			      })
	      }
      else {
	        res.sendStatus(404);
        }});
  }

  function updateUser(req, res) {
    var user = req.body;
    userModel.updateUser(user)
      .then(function (user) {
        req.session['currentUser'] = user;
        res.json(user);
      })
  }

  function findAllUsers(req, res) {
    userModel.findAllUsers()
      .then(function (users) {
        res.send(users);
      })
  }

	function getUser(req, res) {
		if (req.session['currentUser'] !== undefined) {
			res.sendStatus(200);
		} else {
			res.sendStatus(404);
		}
	}
}
