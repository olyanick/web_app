var Reflux = require('reflux');
var Qajax = require('qajax');
var config = require('../config');

var AuthActions = Reflux.createActions([
  "getLoginedUser",
  "addLoginedUser",
  "register",
  "login",
  "logout"
]);

AuthActions.getLoginedUser.listen( function() {

  Qajax({ url: config.urls.getLoginedUser, method: "GET" })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      AuthActions.addLoginedUser(data);
    })
    .done();
});
AuthActions.register.listen( function(data) {
  Qajax({ url: config.urls.register, method: "POST",data:data })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      AuthActions.addLoginedUser(data);
    })
    .done();
});
AuthActions.login.listen( function(data) {
  Qajax({ url: config.urls.login, method: "POST",data:data })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      AuthActions.addLoginedUser(data);
    })
    .done();
});

AuthActions.logout.listen( function() {

  Qajax({ url: config.urls.logout, method: "GET" })
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      AuthActions.addLoginedUser(data);
    })
    .done();
});
module.exports = AuthActions;
