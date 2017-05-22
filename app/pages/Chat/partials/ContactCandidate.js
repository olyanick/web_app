var React = require('react');
var Link = require('react-router').Link;
var ChatActions = require('./../../../actions/ChatActions');


var ContactCandidate = React.createClass({
  sendInvite: function(){
    ChatActions.inviteContact({id:this.props.id});
  },
  render: function(){
    return (
      <div className="dialog addContact">
        <div className="dialogImg">
          <img src={this.props.avatar} alt=""/>
        </div>
        <div className="dialogDetails">
          <div className="name">{this.props.name}</div>
          <button className="button_primary" onClick={this.sendInvite}>Пригласить</button>
        </div>
      </div>
    );
  }
});
module.exports = ContactCandidate;
