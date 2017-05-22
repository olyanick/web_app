var Reflux = require('reflux');
var AuthActions = require('../actions/AuthActions');
var ChatActions = require('../actions/ChatActions');
var UserActions = require('../actions/UserActions');

var AuthStore = Reflux.createStore({
  user:{},
  currentDialog:-1,

  init: function() {

    AuthActions.getLoginedUser();
    UserActions.uploadingSubscribe();
    this.listenTo(AuthActions.addLoginedUser, this.updateData);
  },
  getData:function(){
    return this.user;
  },

  updateData: function(data) {

   this.user = data;
   this.trigger(data);
    ChatActions.selfSubscribe(data.id);
  },
  setCurrentDialog: function(num){
    console.log("dialog:"+AuthStore.getCurrentDialog());
    this.currentDialog = num;
  },
  getCurrentDialog: function(){
    return this.currentDialog;
  },


});

module.exports = AuthStore;
