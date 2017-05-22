var React = require('react');
var Link = require('react-router').Link;
var UserActions = require('./../../../actions/UserActions');
var UserRole = require('./UserRole');
var _ = require('underscore');
var Select = require('react-select');

var UserRoles = React.createClass({
  getInitialState: function(){
    return {userSearch:""}
  },
  inputChange: function(){
    this.props.data = this.refs[this.props.refName].value;
  },
  addGroup: function(){
    var name = this.refs["name"].value;
    UserActions.addGroup({
      name: name,
      members: this.members
    })
  },
  componentDidMount: function(){

  },
  setMembers:function (i, members){
    this.members = _.pluck(members,"value") ;
  },
  userSearch:function(){
    this.setState({
      userSearch: this.refs["userSearch"].value
    })
  },
  render: function(){
    var _this = this;

    var users = this.props.users.map(function(user){
      var expr = new RegExp(_this.state.userSearch ,'ig');
      if(_this.state.userSearch == "" || expr.test(user.name)){
        return(
          <UserRole user = {user}
                    key  = {user.id} />

        );
      }

    });



    return (
      <div className="groupsList">
        <h2>Права пользователей:</h2>
        <table className="table">
          <tbody>
          <tr className="transparent">
            <td style={{width:"60%"}}><input onChange={this.userSearch}className="input" ref="userSearch" type="text" placeholder="Поиск пользователей"/></td>
            <td style={{width:"20%"}}></td>
            <td style={{width:"20%"}}></td>
          </tr>
          {users}
          </tbody>
        </table>

      </div>
    );
  }
});
module.exports = UserRoles;
