var React = require('react');
var Link = require('react-router').Link;

var ChatActions = require('../../../actions/ChatActions');

var ContactInviteOfMe = React.createClass({
  accept:function(){
    ChatActions.acceptContact(this.props.id);
  },
  decline:function(){
    ChatActions.declineContact(this.props.id);
  },
  render: function(){
    return (
      <div className="dialog addContact">
        <div className="dialogImg">
          <img src={this.props.avatar} alt=""/>
        </div>
        <div className="dialogDetails">
          <div className="name">{this.props.name}</div>
          <button className="button_primary" onClick={this.accept}>Принять</button>
          <button className="button_cancel" onClick={this.decline}>Отклонить</button>
        </div>
      </div>
    );
  }
});
module.exports = ContactInviteOfMe;
