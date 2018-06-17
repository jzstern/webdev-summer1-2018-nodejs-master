var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var userModel = mongoose.model('UserModel', userSchema);

function findUserByCredentials(credentials) {
  return userModel.findOne(credentials);
}

function findUserById(userId) {
  return userModel.findById(userId);
}

function findUserByUsername(username) {
  return userModel.findOne({username: username});
}

function createUser(user) {
  return userModel.create(user);
}

function findAllUsers() {
  return userModel.find();
}

function updateUser(user) {
  return userModel.update({_id: user._id}, {$set: user});
}

var api = {
  createUser: createUser,
  updateUser: updateUser,
  findAllUsers: findAllUsers,
  findUserById: findUserById,
  findUserByUsername: findUserByUsername,
  findUserByCredentials: findUserByCredentials
};

module.exports = api;