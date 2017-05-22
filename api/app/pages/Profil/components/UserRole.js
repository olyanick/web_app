var React = require('react');
var Link = require('react-router').Link;
var UserActions = require('./../../../actions/UserActions');
var Group = require('./Group');
var _ = require('underscore');
var Select = require('react-select');
var UserRoles = React.createClass({
  getInitialState: function(){
    return {roles:[
              {value:"worker",label:"worker"},
              {value:"manager",label:"manager"},
              {value:"admin",label:"admin"}
            ]
    };
  },

  save: function(){
    if(!this.state.role){return;}
    UserActions.updateUserRole({
      id: this.props.user.id,
      role: this.state.role
    })
  },
  componentDidMount: function(){

  },
  setRole:function (role){
    this.state.role = role ;
    var i;
  },

  render: function(){
   var user_role = {value:this.props.user.role,label:this.props.user.role};

    return (
          <tr >
            <td><p>{this.props.user.name}</p></td>
            <td>   <Select
              name="roles"
              value = {user_role}
              options = {this.state.roles}
              onChange ={this.setRole}
              />
            </td>
            <td><button className="button_primary button_small" onClick={this.save}>Сохранить</button></td>
          </tr>
    );
  }
});
module.exports = UserRoles;
