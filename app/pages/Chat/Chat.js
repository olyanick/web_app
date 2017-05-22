var React = require('react');
var Link = require('react-router').Link;
var _    = require('underscore');


var Dialog = require('./partials/Dialog');
var ContactCandidate = require('./partials/ContactCandidate');
var ContactInvite = require('./partials/ContactInvite');
var Contact = require('./partials/Contact');
var ContactInviteOfMe = require('./partials/ContactInviteOfMe');
var DialogPreson = require('./partials/DialogPerson');
var SingleDialogPerson = require('./partials/SingleDialogPerson');
var Message = require('./partials/Message');

var ChatStore = require('./../../stores/ChatStore');
var AuthStore = require('./../../stores/AuthStore');
var ChatActions = require('./../../actions/ChatActions');

var Chat = React.createClass({

  componentDidMount: function(){
    this.unsubscribe = ChatStore.listen(this.updateData);
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;

    var _this = this;
    setInterval(function(){
      AuthStore.setCurrentDialog(_this.state.selectedDialog);
    },2000);
  },
  componentWillUnmount: function() {

    this.unsubscribe();
  },
  getInitialState: function(){
    var data = ChatStore.getData();
    return ({dialogSearch : "",
             contactSearch : "",
             selectedDialog: -1,
             currentTab    : 1,
             notInContacts : data.notInContacts,
             myInvites     : data.myInvites,
             invitesOfMe   : data.invitesOfMe,
             contacts      : data.contacts,
             dialogs       : data.dialogs,
             uploadAvatar  : undefined});
    AuthStore.setCurrentDialog(this.state.selectedDialog);

  },
  updateData: function(){

    var newData       = ChatStore.getData();
    var currentDialog = _.find(newData.dialogs,function(dialog){
      return dialog ? dialog.dialog.id == this.state.selectedDialog : false;
    }, this);

    this.setState({
      notInContacts : newData.notInContacts,
      myInvites     : newData.myInvites,
      invitesOfMe   : newData.invitesOfMe,
      contacts      : newData.contacts,
      dialogs       : newData.dialogs,
      currentDialog : currentDialog,
      selectedDialog: currentDialog?this.state.selectedDialog:-1});
    document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight;
    AuthStore.setCurrentDialog(this.state.selectedDialog);
  },
  handleFile: function(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];


    reader.onload = function(upload) {
      self.state.uploadAvatar = upload.target.result;
    };

    reader.readAsDataURL(file);
  },
  changeTab: function(num){
    this.setState({currentTab:num});
  },
  selectDialog:function(val){
    var currentDialog = _.find(this.state.dialogs,function(dialog){
      return dialog.dialog.id == val;
    }, this);
    this.setState({
      currentDialog :currentDialog,
      selectedDialog:val
    });
    AuthStore.setCurrentDialog(this.state.selectedDialog);

  },
  sendMessage: function(){
    ChatActions.sendMessage({
      text :  this.refs['message'].value,
      dialog: this.state.selectedDialog
    });
    this.refs['message'].value = "";
  },
  createDialog:function(){
    var _this = this;
    var options = '';
    for( var i=0; i<this.state.contacts.length;i++){
      options+=' <option value="'+this.state.contacts[i].user_id+'">'+this.state.contacts[i].name+'</option>'
      }
    swal({
        title: 'Создание диалога',
        html:  "<form id='dialogCreator'>" +
        "<input style='margin: 0 0 15px 0;'  class='input' name='name' type='text' placeholder='Введите название диалога' />" +
        '<select name="members"  style="    width: 100%;" class="select2target" multiple="multiple">'+
        '<option value=""><option>'+
        options+
        '</select>'+
        "<br/><label for='dialogAvatar'>Изображение диалога:</label>"+
        "<input id='dialogCreatorAvatar' name='avatar' id='dialogAvatar'name='avatar' type='file' />" +
        "</form>",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Создать',
        cancelButtonText: 'Отмена',
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function(isConfirm) {
        if(!isConfirm){
          return;
        }
        var rawData = $('#dialogCreator').serializeArray();
        var sendData = {
          members :[]
        };
        _.each(rawData,function(value){
            if(value.name == "members"){
              sendData.members.push(value.value);
            } else {
              sendData[value.name] = value.value;
            }
        });
        if(_this.state.uploadAvatar){
          sendData.avatar = _this.state.uploadAvatar;
        }
        ChatActions.createDialog(sendData);
            swal(
              'Созано!',
              'Можете начинать беседу',
              'success'     );
        });

    jQuery(".select2target").select2({
      placeholder: "Выберите учасников диалога:",
      allowClear: true
    });
    $("#dialogCreatorAvatar").on('change',this.handleFile);

  },
  addMember: function(){
    var _this = this;
    var contacts = _.pluck(this.state.contacts,'user_id');
    var members = _.map(this.state.currentDialog.dialog.membrs,function(member){
      return member.user.id
    });
    var diff = _.difference(contacts,members);
    var candidates = _.filter(this.state.contacts, function(contact){
      return diff.indexOf(contact.user_id)!= -1;
    });
    var options = _.map(candidates,function(candidate){
      return ' <option value="'+candidate.user_id+'">'+candidate.name+'</option>';
    }).join("");

    swal({
        title: 'Добавление пользователя',
        html:  "<form id='memberAdder'>" +
        '<select name="member" id="dialogMember"  style="    width: 100%;" class="select2target" >'+
        '<option value=""><option>'+
        options+
        '</select>'+
        "</form>",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Добавить',
        cancelButtonText: 'Отмена',
        closeOnConfirm: false,
        closeOnCancel: true
      },
      function(isConfirm) {
        if(isConfirm){
          var rawData = {
            user: $("#dialogMember").val(),
            dialog: _this.state.selectedDialog
          };
          ChatActions.addMember(rawData);
          swal(
            'Пользователь добавлен!',
            'Теперь он может участвовать в беседе',
            'success'     );
        }

      });
    jQuery(".select2target").select2({
      placeholder: "Выберите учасников диалога:",
      allowClear: true
    });
  },
  typing:function(){
    var dialog = AuthStore.getCurrentDialog();
    var user = AuthStore.getData();
    ChatActions.sendTyping({user:user,dialog:dialog});
  },
  dialogSearch: function(){
    this.setState({
      dialogSearch: this.refs["dialogSearch"].value
    })
  },
  contactSearch:function(){
    this.setState({
      contactSearch: this.refs["contactSearch"].value
    })
  },
  deleteDialog: function(){
    var _this = this;
    swal({
        title: 'Вы уверены?',
        text: 'Диалог и все сообщения будут удалены',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, удалить!',
        closeOnConfirm: false },
      function(isConfirm) {

        if(isConfirm){
          ChatActions.deleteDialog({
            dialog:_this.state.currentDialog
          });
          swal(
            'Диалог удален!',
            '',
            'success'   );
        }

      });
  },
  exitDialog: function(){
    var _this = this;
    swal({
        title: 'Вы уверены?',
        text: 'Вы будете удалены с диалога!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Да, удалить!',
        closeOnConfirm: false },
      function(isConfirm) {

        if(isConfirm){
          ChatActions.deleteMember({
            dialog:_this.state.currentDialog.dialog.id,
            user : AuthStore.getData().id
          });
          swal(
            'Вы покинули диалог!',
            '',
            'success'   );
        }

      });
  },
  render: function(){
    var _this = this;
    var dialogs = this.state.dialogs.map(function(dialog){
      var cover ;
      if(!dialog){return}
      if(dialog.dialog.type == "single"){
        dialog = dialog.dialog;
        cover = dialog.membrs[0] ? dialog.membrs[0].user : {avatar:"", name:"",status:"", online:""}
      } else {
        dialog = dialog.dialog;
        cover = dialog;
        cover.status = '';
        cover.online = '';

      }
      var expr = new RegExp(_this.state.dialogSearch ,'ig');
      if(_this.state.dialogsSearch == "" || expr.test(cover.name)){
        return(

          <Dialog avatar = {cover.avatar}
                  name   = {cover.name}
                  status = {cover.status}
                  online = {cover.online}
                  key    = {dialog.id}
                  id     = {dialog.id}
                  click = {_this.selectDialog.bind(_this,dialog.id)}
                  current = {_this.state.selectedDialog}
                  type    = {dialog.type}
            />
        );
      }

    });
    var dialogPersons = (function(){

      if(_this.state.currentDialog){
        return _this.state.currentDialog.dialog.membrs.map(function(member){
          member = member.user;

          if(_this.state.currentDialog.dialog.type == "single"){
            return (
              <SingleDialogPerson avatar = {member.avatar}
                                  name   = {member.name}
                                  status = {member.status}
                                  description  = {member.description}
                                  online = {member.online}
                                  key    = {member.id}
                                  id     = {member.id}
                                  dialog = {_this.state.currentDialog.dialog.id}/>
            );
          } else {
            return (
              <DialogPreson avatar = {member.avatar}
                            name   = {member.name}
                            key    = {member.id}
                            id     = {member.id}
                            creator= {_this.state.currentDialog.dialog.creator}
                            dialog = {_this.state.currentDialog.dialog.id}/>
            );
          }
        });
      }
    })();
    var messages = function(){

      if(_this.state.currentDialog){

        return _this.state.currentDialog.dialog.msg.map(function(msg){
          return (
            <Message avatar = {msg.sender.avatar}
                     text   = {msg.text}
                     name   = {msg.sender.name}
                     date   = {msg.sender.createdAt}
                     key    = {msg.id}
                     id     = {msg.id}/>
          )
        });
      }
    }();
    var contactsCandidates = this.state.notInContacts.map(function(contact){
      var expr = new RegExp(_this.state.contactSearch ,'ig');
      if(_this.state.contactSearch == "" || expr.test(contact.name)) {
        return (
          <ContactCandidate avatar={contact.avatar}
                            name={contact.name}
                            id={contact.id}
                            key={contact.id}/>
        );
      }
    });
    var contactInvites = this.state.myInvites.map(function(contact){
      var expr = new RegExp(_this.state.contactSearch ,'ig');
      if(_this.state.contactSearch == "" || expr.test(contact.receiver.name)) {
        return (
          <ContactInvite avatar={contact.receiver.avatar}
                         name={contact.receiver.name}
                         id={contact.id}
                         key={contact.id}/>
        );
      }
    });
    var contactInvitesOfMe = this.state.invitesOfMe.map(function(contact){
      var expr = new RegExp(_this.state.contactSearch ,'ig');
      if(_this.state.contactSearch == "" || expr.test(contact.sender.name)) {
        return (
          <ContactInviteOfMe avatar={contact.sender.avatar}
                             name={contact.sender.name}
                             id={contact.id}
                             key={contact.id}/>
        );
      }
    });
    var contacts = this.state.contacts.map(function(contact){
      var expr = new RegExp(_this.state.contactSearch ,'ig');
      if(_this.state.contactSearch == "" || expr.test(contact.name)) {
        return (
          <Contact avatar={contact.avatar}
                   name={contact.name}
                   id={contact.id}
                   key={contact.id}/>
        );
      }
    });
    var group, creator;
    if(this.state.currentDialog){
       creator = this.state.currentDialog.dialog.creator;
       group = this.state.currentDialog.dialog.type == 'group';
    } else{
       creator =false;
       group = false;
    }

    return (
      <div className="chat">
        <div className="chatControl">
          <div className="chatControlHeader">
            <div className="chatTabs">
              <div className={(this.state.currentTab==1?"currentTab ":"")+"chatTab dialogsTab"} onClick={this.changeTab.bind(this,1)}></div>
              <div className="chatTab addDialog" onClick={this.createDialog}></div>
              <div className={(this.state.currentTab==2?"currentTab ":"")+"chatTab addContactTab"} onClick={this.changeTab.bind(this,2)}></div>
            </div>
          </div>
          <div className="chatTabsContent">
            <div className="dialogs" style={{display:this.state.currentTab==1?"block ":"none"}}>
              <div className="searchBlock">
                <input ref="dialogSearch" onChange={this.dialogSearch} className="input" type="text" placeholder="поиск..."/>
              </div>
              <div className="dialogsList">
                {dialogs}
              </div>
            </div>
            <div className="addContacts" style={{display:this.state.currentTab==2?"block ":"none"}}>
              <div className="searchBlock">
                <input ref="contactSearch" className="input"  onChange={this.contactSearch} type="text" placeholder="поиск..."/>
              </div>
              <div className="dialogsList">
                <p>Входящие заявки:</p>
                {contactInvitesOfMe}
                <p>Исходящие заявки:</p>
                {contactInvites}
                <p>Мои контакты:</p>
                {contacts}
                <p>Кандидаты:</p>
                {contactsCandidates}
              </div>
            </div>
          </div>
        </div>
        <div className="chatContent" style={{display: this.state.selectedDialog == -1 ? "none":"block"}}>
          <div className="chatContentHeader">
            <div onClick={this.exitDialog}className="exitDialog" style={{display: group?"block":"none"}}></div>
            <div onClick={this.deleteDialog} className="deleteDialog" style={{display:creator?(group?"block":"none"):"none"}} ></div>
            <div onClick={this.addMember} style={{display:creator?(group?"block":"none"):"none"}} className="addDialogPerson"></div>

          </div>
          <div  className="dialogPeople  clearfix">
            {dialogPersons}
         </div>
          <div className="messages">
            {messages}
          </div>
          <div className="messageSend">
            <textarea onKeyDown={this.typing} ref="message" name="message" id="messageTextarea" placeholder="Введите сообщение..."></textarea>
            <div onClick={this.sendMessage}  className="messageSendButton"></div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = Chat;
