var React = require('react');
var Link = require('react-router').Link;

var AuthStore = require('./../../stores/AuthStore');
var ProfileStore = require('./../../stores/ProfileStore');
var EditableInput = require('./components/EditableInput');
var GroupsList = require('./components/GroupsList');
var UserRoles = require('./components/UserRoles');
var UserActions = require('./../../actions/UserActions');
var Select = require('react-select');
var Profil = React.createClass({
  getInitialState: function(){
    return {
              user:ProfileStore.getData().user,
              contacts:ProfileStore.getData().contacts,
              groups:ProfileStore.getData().groups,
              users:ProfileStore.getData().users
    };
  },
  componentDidMount: function(){
    this.unsubscribe = AuthStore.listen(this.updateData);
    this.unsubscribe2 = ProfileStore.listen(this.updateData);

  },
  componentWillUnmount: function() {
    this.unsubscribe();
    this.unsubscribe2();
  },
  updateData: function(data){
    this.setState(
      {
        user:ProfileStore.getData().user,
        contacts:ProfileStore.getData().contacts,
        groups:ProfileStore.getData().groups,
        users:ProfileStore.getData().users
      });
  },
  updateUser: function(data){
    UserActions.updateUser(data);
  },
  handleFile: function(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      self.updateUser({avatar: upload.target.result})
    };

    reader.readAsDataURL(file);
  },
  render: function(){
    var _this = this;
    var userRoles = function(){
      if(_this.state.user.role !="worker"){
        return(
          <UserRoles users={_this.state.users} />
        );
      }

    }();
    return (
      <div className="profile">
        <div className="userpic">
          <img src={this.state.user.avatar} />
          <div className="editor"></div>
          <input className="input" onChange={this.handleFile} type="file"/>
        </div>
        <div className="userinfo">

          <EditableInput descr={"ФИО"} onUpdate={this.updateUser} refName={"name"} tagName={"h1"} data={this.state.user.name} />
          <EditableInput descr={"Статус"}  onUpdate={this.updateUser} refName={"status"} tagName={"p"} data={this.state.user.status} placeholder={"Введите ваш текущий статус"} />
          <div className="field">
            <div className="descr">
              Email
            </div>
            <div className="cont">
              <a>{this.state.user.email}</a>
            </div>
            <div className="edit"></div>
          </div>
          <EditableInput descr={"Описание"} onUpdate={this.updateUser} refName={"description"} tagName={"p"} data={this.state.user.description} placeholder={"Введите доп. информацию про вас"} />
        </div>
        <div className="clearfix"></div>
        <GroupsList groups={this.state.groups}
                    contacts={this.state.contacts}/>
        {userRoles}

      </div>

    );
  }
});
module.exports = Profil;
