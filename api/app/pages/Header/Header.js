var React = require('react');
var Link = require('react-router').Link;
var History = require('react-router').History;
var AuthActions = require('./../../actions/AuthActions');
var ChatActions = require('./../../actions/ChatActions');

var Header = React.createClass({
  getInitialState:function(){
    return({
      newMessages:0
    })
  },
  mixins:[History],
  logout: function(e){
    e.preventDefault();
    e.stopPropagation();
    AuthActions.logout();

  },
  componentDidMount:function(){
    ChatActions.newMessage.listen(this.newMessage);
  },
  clearUnreaded: function(){
    this.setState({newMessages:0});
  },
  newMessage: function(msg){
    if(this.props.app.location.pathname != "/chat"){
      this.setState({newMessages:this.state.newMessages+1});
    } else {
      this.setState({newMessages:0});
    }
  },
  render: function(){
    var isProfile = this.props.app.location.pathname == "/profil"?" currentPage":"";
    var isChat = this.props.app.location.pathname == "/chat"?" currentPage":"";
    var isFiles = this.props.app.location.pathname == "/files"?" currentPage":"";
    var isPublicFiles = this.props.app.location.pathname == "/public_files"?" currentPage":"";
    var isSchedule = this.props.app.location.pathname == "/schedule"?" currentPage":"";
    var logined = this.props.logined?(this.props.logined.email?"block":"none"):"none";
    var unlogined = logined=="block"?"none":"block";
     return (

       <header className="clearfix">
          <a className="logo" href="#"></a>
          <ul>
            <li className={isProfile} style={{display:logined}}><Link to={"/profil"}>Профиль</Link></li>
            <li onClick={this.clearUnreaded} className={isChat} style={{display:logined}}>
              <Link to={"/chat"} >Чат</Link>
              <div style={{display:this.state.newMessages>0?"block":"none"}} className="incomeMessages">{this.state.newMessages}</div>
            </li>
            <li className={isFiles} style={{display:logined}}><Link to={"/files"} >Файлы</Link></li>
            <li className={isPublicFiles} style={{display:logined}}><Link to={"/public_files"} >Общие файлы</Link></li>
            <li className={isSchedule} style={{display:logined}}><Link to={"/schedule"} >Планировщик</Link></li>
          </ul>
            <a   href="/logout" onClick={this.logout} style={{display:logined}}  className="authControl hidden logout"></a>
            <Link to={"/login"} style={{display:unlogined}}  className="authControl login"></Link>
            <Link to={"/register"} style={{display:unlogined}}  className="authControl register"></Link>
       </header>
     )
  }
});
module.exports = Header;
