var React = require('react');

var Header = require('../pages/Header/Header');

var AuthActions = require('./../actions/AuthActions');
var AuthStore = require('./../stores/AuthStore');
var UserActions = require('./../actions/UserActions');
import { History } from 'react-router';
var NotificationSystem = require('react-notification-system');
var Uploader = require("./../partials/Uploader");

var App = React.createClass({
  mixins: [ History ],
  getInitialState: function(){
    return {};
  },
  componentDidMount: function(){
    this._notificationSystem = this.refs.notificationSystem;
    AuthStore.listen(this.updateData);
    UserActions.createNotification.listen(this._addNotification);
    ion.sound({
      sounds: [
        {name: "glass"},
      ],

      path: "js/sounds/",
      preload: true,
      multiplay: true,
      volume: 0.9
    });
  },
  _notificationSystem: null,

  _addNotification: function(data) {
    this._notificationSystem.addNotification(data);

    ion.sound.play("glass");
  },
  updateData: function(data){
    this.setState({user:data});
    if(this.state.user && !this.state.user.email && ['/chat','/profil','/schedule','/files'].indexOf(this.props.location.pathname)!=-1){
      this.history.pushState(null, '/login');
    }
  },

  render: function(){

    if(this.state.user && !this.state.user.email && ['/chat','/profil','/schedule','/files'].indexOf(this.props.location.pathname)!=-1){
      this.history.pushState(null, '/login');
    }
    return (
      <div>
        <Uploader />
         <Header app={this.props} logined={this.state.user}/>
        <div style={{display:this.state.user?"block":"none" }}className=" content">
          {this.props.children}
        </div>
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
})

module.exports = App;
