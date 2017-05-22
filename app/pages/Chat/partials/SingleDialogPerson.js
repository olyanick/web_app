var React = require('react');
var Link = require('react-router').Link;
var ChatActions = require('../../../actions/ChatActions');


var SingleDialogPerson = React.createClass({
  getInitialState:function(){
    return({
      typing: false
    })
  },
  componentDidMount: function(){
    ChatActions.typingFromSubscribe.listen(this.typing)
  },
  typing:function(data){

    if(this.props.id == data.user.id && this.props.dialog == data.dialog){
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
  render: function(){

    return (
      <div className="singleDialogPerson clearfix">
        <div className="dialogPersonImg">
          <img src={this.props.avatar} alt=""/>
          <div className={"typing "+(this.state.typing?"show":"")}></div>
        </div>
        <div className="dialogPersonDetails">
          <h2 className="name">{this.props.name}</h2>
          <p className="status">{this.props.status}</p>
          <p className="about">{this.props.description}</p>
          <div className={this.props.online}>{this.props.online}</div>
        </div>
      </div>
    );
  }
});
module.exports = SingleDialogPerson;
