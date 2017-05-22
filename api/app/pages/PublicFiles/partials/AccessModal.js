var React = require('react');
var Select = require("react-select");
var _ = require('underscore');
var FilesActions =require('./../../../actions/FilesActions');
var AccessModal = React.createClass({
  getInitialState: function(){
    return ({selected:this.props.access});
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({
      selected:nextProps.access
    });
  },
  close:function(){
   this.props.closeModal();
  },
  setType: function(e){
    this.setState({selected:e.target.value});
  },
  setGroups:function (i, members){
    this.groups = _.pluck(members,"value") ;
  },
  save: function(){
    var type = this.state.selected;
    var groups = this.groups;
    var data = {
      type: type,
      groups: groups,
      id : this.props.id
    };
    FilesActions.saveAccess(data);
  },
  render: function(){
    var _this = this;
    var options = [];
    this.props.groups.map(function(group){
      options.push({value:group.id,label:group.name})
    });

    var selectedGroups = _.pluck(this.props.selectedGroups,"group");
    var value =  _.filter( this.props.groups, function(group){
      return selectedGroups.indexOf(group.id)!=-1;
    });
    value = _.map(value,function(val){
      return {value:val.id,label:val.name};
    });

    //var selected = _.pluck(this.props.members,"user");
    //
    //var filtered = _.filter(this.props.contacts,function(elem) {
    //  return selected.indexOf(elem.user_id) != -1
    //});
    //var value = _.map(filtered,function(elem){
    //  return {value:elem.user_id,label:elem.name}
    //});
    //value = value ? (value[0] ? value:[]) : [];

    return(
      <div style={{display: this.props.showAccess ?"block":"none"}} className="modal">
        <div className="modal-body">
          <table className="mb-15">
            <tbody>
            <tr>
              <td>
                <input onChange={this.setType} type="radio" checked  ={this.state.selected == "private"} name="type" value="private" id="radio1" className="css-checkbox" />
                <label htmlFor="radio1" className="css-label" >Приватный</label>
              </td>
              <td>
                <input onChange={this.setType} type="radio"  checked  ={this.state.selected == "public"} name="type" value="public" id="radio2" className="css-checkbox" />
                <label htmlFor="radio2" className="css-label" >Публичный</label>
              </td>
              <td>
                <input onChange={this.setType} type="radio"  checked  ={this.state.selected == "group"} name="type" value="group" id="radio3" className="css-checkbox" />
                <label htmlFor="radio3" className="css-label" >Групповой</label>
              </td>
            </tr>

            </tbody>
          </table>
          <div  style={{display:this.state.selected == "group"?"block":"none"}} className="groupsTab mb-15">
            <Select
              name="members"
              options={options}
              value ={value}
              multi={true}
              onChange={this.setGroups}
              />
          </div>
          <div style={{display:["group","public"].indexOf(this.state.selected) != -1 ?"block":"none"}}>
            <p>Ссылка на скачивание:<a href={this.props.link} download>{this.props.link}</a></p>
          </div>
          <div className="modalControls clearfix">
            <button className="button_small pull-right" onClick={this.close}>Закрыть</button>
            <button className="button_primary button_small pull-right mr-5" onClick={this.save}>Сохранить</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AccessModal;
