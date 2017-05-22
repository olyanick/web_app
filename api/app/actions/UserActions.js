var Reflux = require('reflux');
var Qajax = require('qajax');
var config = require('../config');
var AuthActions = require('./AuthActions');
var UserActions = Reflux.createActions([
  "updateUser",
  "setNotInContacts",
  "getNotInContacts",
  "createNotification",
  "addNotification",
  "uploadingSubscribe",
  "progress",
  "getGroups",
  "setGroups",
  "addGroup",
  "deleteGroup",
  "updateGroup",
  "getUsers",
  "setUsers",
  "updateUserRole",
  "reloadData"
]);

UserActions.updateUser.listen( function(data) {

  Qajax({ url: config.urls.updateUser, method: "PUT" ,data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      AuthActions.addLoginedUser(data);
    })
    .done();
});
UserActions.updateUserRole.listen( function(data) {

  Qajax({ url: config.urls.updateUserRole, method: "PUT" ,data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      UserActions.getUsers();
    })
    .done();
});
UserActions.createNotification.listen( function(data) {
  UserActions.addNotification(data);
});
UserActions.uploadingSubscribe.listen( function(thisUser) {
  io.socket.on('uploading',function(val){
    UserActions.progress(val);
  });
});

UserActions.addGroup.listen( function(data) {

  Qajax({ url: config.urls.addGroup, method: "POST" ,data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      UserActions.getGroups(data);
    })
    .done();
});
UserActions.getGroups.listen( function(data) {

  Qajax({ url: config.urls.addGroup, method: "GET" })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      UserActions.setGroups(data);
    })
    .done();
});
UserActions.deleteGroup.listen( function(data) {

  Qajax({ url: config.urls.deleteGroup, method: "DELETE" ,data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      UserActions.getGroups();
    })
    .done();
});
UserActions.updateGroup.listen( function(data) {

  Qajax({ url: config.urls.updateGroup, method: "PUT" ,data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      UserActions.getGroups();
    })
    .done();
});
UserActions.getUsers.listen( function(data) {

  Qajax({ url: config.urls.getUsers, method: "GET" })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      UserActions.setUsers(data);
    })
    .done();
});

module.exports = UserActions;
