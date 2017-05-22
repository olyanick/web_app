var React = require('react');
var Link = require('react-router').Link;


var EditableInput = React.createClass({
  getInitialState: function(){
    return({edit:false,data:this.props.data})
  },
  inputChange: function(){
    this.props.data = this.refs[this.props.refName].value;
  },
  toggleEdit: function(value){
    this.setState({edit:value})
  },
  update: function(){
    var data ={};
    data[this.props.refName]=this.refs[this.props.refName].value;

    this.props.onUpdate(data);
    this.toggleEdit(false);
  },
  render: function(){
    return (
      <div className="field">
        <div className="descr">{this.props.descr}</div>
        <div className="cont">
          <this.props.tagName style={{display:this.state.edit==false?'block':'none'}}>{this.props.data===null?this.props.placeholder:this.props.data}
          </this.props.tagName>
          <input className="input" style={{display:this.state.edit==false?'none':'block'}}   onChange={this.inputChange} type='text' value={this.props.data} ref={this.props.refName}/>
        </div>
        <div className="edit">
          <div style={{display:this.state.edit==false?'block':'none'}} onClick={this.toggleEdit.bind(this,true)} className="editor" ></div>
          <div style={{display:this.state.edit==true?'block':'none'}} onClick={this.update} className="saver" ></div>
        </div>
      </div>
    );
  }
});
module.exports = EditableInput;
