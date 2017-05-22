var React = require('react');
var Link = require('react-router').Link;
var UserActions = require('./../../../actions/UserActions');
var Group = require('./Group');
var _ = require('underscore');
var Select = require('react-select');
var GroupsList = React.createClass({
  getInitialState: function(){
    return {groupSearch:""}
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
  groupSearch:function(){
    this.setState({
      groupSearch: this.refs["groupSearch"].value
    })
  },
  render: function(){
    var _this = this;
    var options = [];
    this.props.contacts.map(function(contact){
      options.push({value:contact.user_id,label:contact.name})
    });
    var groups = this.props.groups.map(function(group){
      var expr = new RegExp(_this.state.groupSearch ,'ig');
      if(_this.state.groupSearch == "" || expr.test(group.name)){
        return(
          <Group key={group.id}
                 id={group.id}
                 name={group.name}
                 members={group.members}
                 contacts={_this.props.contacts}/>
        );
      }
    });

    return (
      <div className="groupsList">
        <h2>Группы пользователей:</h2>
        <table className="table">
          <tbody>
          <tr className="transparent">
            <td style={{width:"30%"}}><input  onChange={this.groupSearch} ref="groupSearch" className="input" type="text" placeholder="Поиск по названию группы"/></td>
            <td style={{width:"60%"}}></td>
            <td style={{width:"20%"}}></td>
          </tr>
          <tr className="transparent">
            <td><input ref="name" className="input" type="text" placeholder="Название новой группы"/></td>
            <td>
              <Select
                name="members"
                options={options}
                multi
                onChange={this.setMembers}
                placeholder={"Выберите учасников"}
                />
            </td>
            <td><button className="button_primary button_small" onClick={this.addGroup}>Добавить</button></td>
          </tr>
          {groups}
          </tbody>
        </table>

      </div>
    );
  }
});
module.exports = GroupsList;
