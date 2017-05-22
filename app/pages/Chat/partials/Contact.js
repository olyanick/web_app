var React = require('react');
var Link = require('react-router').Link;
var ChatActions = require('../../../actions/ChatActions');


var Contact = React.createClass({
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
          <button className="button_primary" onClick={this.decline}>Удалить</button>

        </div>
      </div>
    );
  }
});
module.exports = Contact;
