var React = require('react');
var Link = require('react-router').Link;
var moment = require('moment');


var Message = React.createClass({

  render: function(){
    var time = moment(this.props.date).format("DD.MM.YYYY HH:m:ss");
    return (
      <div className="message">
        <div className="messageImg">
          <img src={this.props.avatar} alt=""/>
        </div>
        <div className="messageContent">
          <a className="messageAuthor">{this.props.name}</a>
          <div className="messageText">{this.props.text}</div>
        </div>
        <div className="messageDate">{time}</div>
      </div>
    );
  }
});
module.exports = Message;
