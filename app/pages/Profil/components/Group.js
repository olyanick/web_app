var React = require('react');
var Link = require('react-router').Link;
var UserActions = require('../../../actions/UserActions');
var _ = require('underscore');
var Select = require('react-select');
var Group = React.createClass({

  componentDidMount: function(){


  },
  inputChange: function(){
    this.props.data = this.refs[this.props.refName].value;
  },
  save: function(){
    var name = this.refs["name"].value;
    UserActions.updateGroup({
      name: name,
      members: this.members,
      id: this.props.id
    })
  },
  delete: function(){
    UserActions.deleteGroup({
      id: this.props.id
    })
  },
  setMembers:function (i, members){
    this.members = _.pluck(members,"value") ;
  },
  render: function(){
    var _this = this;
    var options = [];
    this.props.contacts.map(function(contact){
      options.push({value:contact.user_id,label:contact.name})
    });

    var selected = _.pluck(this.props.members,"user");

    var filtered = _.filter(this.props.contacts,function(elem) {
      return selected.indexOf(elem.user_id) != -1
    });
    var value = _.map(filtered,function(elem){
        return {value:elem.user_id,label:elem.name}
    });
    value = value ? (value[0] ? value:[]) : [];
    return (
      <tr>
        <td><input ref='name' onChange={this.inputChange} className="input" type="text" value={this.props.name}/></td>
        <td>
          <Select
            name="members"
            options={options}
            value ={value}
            multi={true}
            onChange={this.setMembers}
            placeholder={"Выберите учасников"}
            />
        </td>
        <td><button className="button_primary button_small" onClick={this.save}>Сохранить</button><button onClick={this.delete} className="button_small">Удалить</button></td>
      </tr>
    );
  }
});
module.exports = Group;
