var React = require('react');
var Link = require('react-router').Link;
var ChatActions = require('../../../actions/ChatActions');


var Dialog = React.createClass({
  getInitialState:function(){
    return({
      typing: false,
      newMessages:0
    })
  },
  componentDidMount: function(){
    ChatActions.typingFromSubscribe.listen(this.typing);
    ChatActions.newMessage.listen(this.newMessage);
  },
  newMessage: function(msg){

    if(msg.dialog.id == this.props.id && msg.dialog.id != this.props.current){
      this.setState({newMessages:this.state.newMessages+1});
    }
  },
  typing:function(data){
    if(this.props.id == data.dialog){
      this.setState({
        typing: true
      });
      if(this.timer){
        clearTimeout(this.timer);
      }
      var _this = this;
      this.timer = setTimeout(function(){
        _this.setState({
          typing: false
        })
      },600);
    }
  },
  clearUnreaded: function(){
    this.setState({newMessages:0});
  },
  render: function(){
    var _this = this;
    return (
      <div className={"dialog "+(this.props.current==this.props.id?"currentDialog":"")}
           onClick = {function(){
            _this.props.click();
            _this.clearUnreaded();
           }}>
        <div className="dialogImg">
          <img src={this.props.avatar} alt=""/>
          <div className={"typing "+(this.state.typing?"show":"")}></div>
          <div style={{display:this.state.newMessages>0?"block":"none"}} className="messageCount">{"+"+this.state.newMessages}</div>
        </div>
        <div className="dialogDetails">
          <div className="name">{this.props.name + (this.props.type =="group"?" (групповой)":"")}</div>
          <div className="status">{this.props.status}</div>
          <div className={this.props.online}>{this.props.online}</div>
        </div>
      </div>
    );
  }
});
module.exports = Dialog;
