var Reflux = require('reflux');
var Qajax = require('qajax');
var config = require('../config');
var FilesActions = Reflux.createActions([
  "saveAccess"
]);

FilesActions.saveAccess.listen( function(data) {

  Qajax({ url: config.urls.saveAccess, method: "POST" ,data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){

    })
    .done();
});


module.exports = FilesActions;
