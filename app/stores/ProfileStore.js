var Reflux = require('reflux');
var ChatStore   = require('../stores/ChatStore');
var AuthStore   = require('../stores/AuthStore');
var AuthActions = require('../actions/AuthActions');
var ChatActions = require('../actions/ChatActions');
var UserActions = require('../actions/UserActions');

var ProfileStore = Reflux.createStore({
  profile:{
    contacts:[],
    groups:[],
    user:{},
    users:[]
  },

  init: function(){
    AuthStore.listen(this.updateUser);
    ChatStore.listen(this.updateContacts);
    UserActions.getGroups();
    UserActions.getUsers();
    UserActions.setGroups.listen(this.updateGroups);
    UserActions.setUsers.listen(this.updateUsers);
  },
  getData:function(){
    return this.profile;
  },
  updateUsers:function(users){
    this.profile.users = users;
    this.trigger(users);
  },
  updateGroups: function(data) {
    this.profile.groups=data;
    this.trigger();
  },
  updateContacts: function(data) {
      this.profile.contacts=ChatStore.getData().contacts;
      this.trigger();
  },
  updateUser: function(data) {
    this.profile.user = AuthStore.getData();
    this.trigger();
  },



});

module.exports = ProfileStore;
