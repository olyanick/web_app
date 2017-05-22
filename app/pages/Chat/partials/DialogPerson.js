var React = require('react');
var Link = require('react-router').Link;
var ChatActions = require('../../../actions/ChatActions');


var DialogPerson = React.createClass({
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
  delete: function(){
    var _this = this;
    swal({
      title: 'Вы уверены?',
      text: 'Пользователь будет удален из диалога',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Да, удалить!',
      closeOnConfirm: false },
      function(isConfirm) {
        if(isConfirm) {
          ChatActions.deleteMember({
            dialog: _this.props.dialog,
            user: _this.props.id
          });
          swal(
            'Пользователь удален!',
            'Теперь он не сможет писать в этом диалоге',
            'success');
        }
      });
  },
  render: function(){
    return (
      <div className="dialogPerson clearfix">
        <div className="dialogPersonImg">
          <img src={this.props.avatar} alt=""/>
          <div className={"typing "+(this.state.typing?"show":"")}></div>
        </div>
        <div className="dialogPersonDetails">
          <h2 className="name">{this.props.name}</h2>
          <div className={this.props.online}>{this.props.online}</div>
          <div onClick={this.delete} style={{display: this.props.creator?"block":"none"}} className="delete"></div>
        </div>
      </div>
    );
  }
});
module.exports = DialogPerson;
