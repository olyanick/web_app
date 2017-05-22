var Reflux = require('reflux');
var ChatActions = require('../actions/ChatActions');
var AuthStore = require("./AuthStore");
var _ = require("underscore");

var ChatStore = Reflux.createStore({
  chat:{
    notInContacts : [],
    myInvites     : [],
    invitesOfMe   : [],
    contacts      : [],
    dialogs       : []
  },
  currentDialog: -1,
  init: function() {
    ChatActions.getContacts();
    ChatActions.getDialogs();


    ChatActions.newUsersSubscribe();
    ChatActions.updateUserSubscribe();
    ChatActions.typingSubscribe();
    ChatActions.dialogDeleteSubscribe();


    AuthStore.listen(this.membersSubscribe);

    this.listenTo(ChatActions.setContacts, this.updateContactsData);
    this.listenTo(ChatActions.setDialogs, this.updateDialogsData);

    this.listenTo(ChatActions.userFromSubscribe, this.addUserToNotInContacts);
    this.listenTo(ChatActions.updateUserFromSubscribe, this.updateUser);
    this.listenTo(ChatActions.newMessage, this.addMessage);
    this.listenTo(ChatActions.newMemberFromSubscribe, this.addMember);
    this.listenTo(ChatActions.deleteMemberFromSubscribe, this.deleteMember);
  },
  getData:function(){
    return this.chat;
  },
  membersSubscribe: function(){
    var id = AuthStore.getData().id;
    var currentDialog = AuthStore.getCurrentDialog();
    var user = AuthStore.getData();
    ChatActions.membersSubscribe(id);
    ChatActions.messagesSubscribe({id:id,dialog:currentDialog});
    ChatActions.dialogCreateSubscribe(user);
    ChatActions.contactCreateSubscribe(user);
    ChatActions.contactInviteSubscribe(user);
    ChatActions.contactInviteDeclineSubscribe(user);
  },
  addUserToNotInContacts:function(data){

    this.chat.notInContacts.push(data.data);
    this.trigger(data.data);
  },
  updateUser: function (user) {
    var _this = this;
    var id = user.id;
    user = _.omit(user, 'id');


    this.chat = _.mapObject(this.chat, function(val, key) {
      return _.map(_this.chat[key],function(elem){
        if(key=="notInContacts" && elem){
          if(elem.id == id){
            return  _.extend(elem, user);
          } else {
            return elem;
          }
        } else if(key=="dialogs" && elem){
          elem.dialog.membrs = _.map(elem.dialog.membrs,function(member){
            if(member.user.id == id){
              member.user =   _.extend(member.user, user);
            }
            return member
          });
          return elem
        } else  {
          if( elem && elem.user_id == id){
            return  _.extend(elem, user);
          } else {
            return elem;
          }
        }
      })
    });
    this.trigger();
  },
  updateContactsData: function(data) {
    this.chat.notInContacts = data.notInContacts;
    this.chat.myInvites     = data.myInvites;
    this.chat.invitesOfMe   = data.invitesOfMe;
    this.chat.contacts      = data.contacts;
    this.trigger(data);
  },
  updateDialogsData: function(data){
    var dialogs = _.map(data,function(elem){
      return elem.dialog.id;
    });
    ChatActions.dialogsSubscribe(dialogs);
    this.chat.dialogs = data;
    this.trigger(data);
  },

  addMessage: function(data){
    this.chat.dialogs = _.map(this.chat.dialogs, function(elem){
      if(elem.dialog.id == data.dialog.id){
        elem.dialog.msg.push(data);
      }
      return elem;
    });
    this.trigger();
  },
  addMember: function(data){
    _.map(this.chat.dialogs,function(elem){
      if(elem.dialog.id == data.dialog.id){
        elem.dialog.membrs.push(data);
      }
      return elem;
    });
    this.trigger();
  },
  deleteMember: function(data){
    this.chat.dialogs =  _.map(this.chat.dialogs,function(elem){
      elem.dialog.membrs = _.map( elem.dialog.membrs,function(member){
        if(member.user.id == elem.user.id){
          return;
        }
        return member;
      });
      return elem;
    });
    this.trigger();
  }

});

module.exports = ChatStore;
