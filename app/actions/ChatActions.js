var Reflux = require('reflux');
var Qajax = require('qajax');
var config = require('../config');
var UserActions = require('./UserActions');
var _ = require("underscore");
var ChatActions = Reflux.createActions([
  "getContacts",
  "setContacts",
  "inviteContact",
  "acceptContact",
  "declineContact",
  "getDialogs",
  "setDialogs",
  "sendMessage",
  "createDialog",
  "deleteMember",
  "addMember",
  "newUsersSubscribe",
  "userFromSubscribe",
  "updateUserSubscribe",
  "updateUserFromSubscribe",
  "dialogCreateSubscribe",
  "contactCreateSubscribe",
  "contactInviteSubscribe",
  "contactInviteDeclineSubscribe",
  "dialogsSubscribe",
  "messagesSubscribe",
  "membersSubscribe",
  "newMessage",
  "newMemberFromSubscribe",
  "selfSubscribe",
  "deleteMemberFromSubscribe",
  "typingSubscribe",
  "sendTyping",
  "typingFromSubscribe",
  "dialogDeleteSubscribe",
  "dialogDeleteFromSubscribe",
  "deleteDialog"
]);

ChatActions.getContacts.listen( function() {

  Qajax({ url: config.urls.getContacts, method: "GET"})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.setContacts(data);
    })
    .done();
});
ChatActions.inviteContact.listen( function(data) {

  Qajax({ url: config.urls.getContacts, method: "POST",data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.getContacts();
    })
    .done();
});
ChatActions.acceptContact.listen( function(id) {

  Qajax({ url: config.urls.getContacts+'/'+id, method: "POST"})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(){
      ChatActions.getContacts();
      ChatActions.getDialogs();
    })
    .done();
});
ChatActions.declineContact.listen( function(id) {

  Qajax({ url: config.urls.getContacts+'/'+id, method: "DELETE"})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(){
      ChatActions.getContacts();
      ChatActions.getDialogs();
    })
    .done();
});

ChatActions.getDialogs.listen( function() {

  Qajax({ url: config.urls.getDialogs, method: "GET"})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.setDialogs(data);
    })
    .done();
});
ChatActions.sendMessage.listen( function(data) {

  Qajax({ url: config.urls.sendMessage, method: "POST",data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.getDialogs();
    })
    .done();
});
ChatActions.createDialog.listen( function(data) {

 return Qajax({ url: config.urls.createDialog, method: "POST",data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.getDialogs();
    });
});

ChatActions.deleteMember.listen( function(data) {

  return Qajax({ url: config.urls.deleteMember, method: "DELETE",data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.getDialogs();
    });
});
ChatActions.addMember.listen( function(data) {
  return Qajax({ url: config.urls.addMember, method: "POST",data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      ChatActions.getDialogs();
    });
});

ChatActions.newUsersSubscribe.listen( function() {

  io.socket.get('/user/watchUser', function(resData, jwres) {
  });

  io.socket.on('user',function(obj){
    ChatActions.userFromSubscribe(obj);
  });
});
ChatActions.selfSubscribe.listen( function(id) {
  io.socket.post('/user/subscribe', {id:id},function(resData, jwres) {
  });
});
ChatActions.updateUserSubscribe.listen( function() {
  io.socket.on('updateUser',function(obj){
    ChatActions.updateUserFromSubscribe(obj);
  });
});
ChatActions.dialogCreateSubscribe.listen( function(thisUser) {
  io.socket.on('dialogCreated',function(obj){

    obj.members = _.map(obj.members, function(member){
      member=+member;
      return member;
    });
    if(obj.members.indexOf(thisUser.id) != -1 ){
      ChatActions.getDialogs();
      UserActions.createNotification(
        {
          title: "Новый диалог",
          message: "Создан новый диалог в который вы были добавлены - "+obj.name,
          level: "info",
          position: "bl",
          autoDismiss: 40
        }
      )
    }

  });
});
ChatActions.contactCreateSubscribe.listen( function(thisUser) {
  io.socket.on('contactCreated',function(obj){

    if(obj.user == thisUser.id) {
      ChatActions.getContacts();
      ChatActions.getDialogs();
      UserActions.createNotification(
        {
          title: "Новый контакт",
          message: "Пользоатель "+obj.name+" принял вашу заявку. Теперь он есть в списке диалогов.",
          level: "info",
          position: "bl",
          autoDismiss: 40
        });
    }
  });
});
ChatActions.contactInviteSubscribe.listen( function(thisUser) {
  io.socket.on('contactInvite',function(obj){

    if(obj.user == thisUser.id) {
      ChatActions.getContacts();
      UserActions.createNotification(
        {
          title: "Новое приглашение",
          message: "Пользоатель "+obj.name+" прислал вам заявку на добавление в контакты." +
          " Приняв ее вы сможете приступить к общению.",
          level: "info",
          position: "bl",
          autoDismiss: 40
        });
    }
  });
});
ChatActions.contactInviteDeclineSubscribe.listen( function(thisUser) {
  io.socket.on('contactInviteDecline',function(obj){

    if(obj.users.indexOf(thisUser.id)!= -1) {
      ChatActions.getContacts();
      ChatActions.getDialogs();
      if(obj.active){
        UserActions.createNotification(
          {
            title: "Удаление из контактов",
            message: "Пользоатель "+obj.name+" удалил вас из контактов." +
            " Теперь вы не сможете вести переписку.",
            level: "error",
            position: "bl",
            autoDismiss: 40
          });
      }
    }
  });
});

ChatActions.dialogsSubscribe.listen( function(data) {

  io.socket.post('/dialogs/subscribe', {dialogs:data}, function (data, jwres){

  });

});
ChatActions.messagesSubscribe.listen( function(data) {
  io.socket.on('newMessage',function(obj){

    ChatActions.newMessage(obj);
    if(data.dialog != obj.dialog.id && data.id != obj.sender.id){
      var dialogName = obj.dialog.name ? " ("+ obj.dialog.name+")" :"";
      UserActions.createNotification(
        {
          title: obj.sender.name + dialogName,
          message: obj.text,
          level: "info",
          position: "br",
          autoDismiss: 10
        });
    }

  });
});
ChatActions.membersSubscribe.listen( function(myid) {

  io.socket.on('newMemberMe',function(obj){
    ChatActions.getDialogs();
    UserActions.createNotification(
      {
        title: "Участие в диалоге",
        message: "Вас добавили в диалог "+obj.dialog.name+". Можете приступать к общению.",
        level: "info",
        position: "bl",
        autoDismiss: 40
      });
  });
  io.socket.on('newMember',function(obj){

    if(myid == obj.user.id){ return }
    ChatActions.newMemberFromSubscribe(obj);
    UserActions.createNotification(
      {
        title: "Новый учасник диалога ",
        message: obj.user.name+" ,был добавлен в диалог "+obj.dialog.name+". Можете приступать к общению.",
        level: "info",
        position: "bl",
        autoDismiss: 40
      });
  });

  io.socket.on('deleteMemberMe',function(obj){

    ChatActions.getDialogs();
    UserActions.createNotification(
      {
        title: "Удаление из диалога",
        message: "Вас удалили из диалога "+obj.dialog.name+". Теперь вы не можете вести там переписку.",
        level: "error",
        position: "bl",
        autoDismiss: 40
      });
  });
  io.socket.on('deleteMember',function(obj){

    if(myid == obj.user.id){ return }
    ChatActions.deleteMemberFromSubscribe(obj);
    UserActions.createNotification(
      {
        title: "Удаление из диалога ",
        message: obj.user.name+" ,был удален из диалога "+obj.dialog.name+". Теперь он не сможет вести там переписку.",
        level: "info",
        position: "bl",
        autoDismiss: 40
      });
  });

});

ChatActions.typingSubscribe.listen( function(data) {
  io.socket.on('typing',function(obj){
    ChatActions.typingFromSubscribe(obj);
  });
});
ChatActions.sendTyping.listen( function(data) {

  io.socket.post('/message/typing',data,function(obj){

  });
});
ChatActions.dialogDeleteSubscribe.listen( function(data) {

  io.socket.on('dialogDelete',function(obj){
    ChatActions.getDialogs();
    UserActions.createNotification(
      {
        title: "Удаление  диалога",
        message: "Диалог "+obj.name+" был удален. Теперь вы не можете вести там переписку.",
        level: "error",
        position: "bl",
        autoDismiss: 40
      });
  });
});
ChatActions.deleteDialog.listen( function(data) {

  return Qajax({ url: config.urls.deleteDialog, method: "DELETE",data})
    .then(Qajax.filterSuccess)
    .then(Qajax.toJSON)
    .then(function(data){
      //ChatActions.getDialogs();
    })
});
module.exports = ChatActions;
