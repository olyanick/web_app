var React = require('react');
var Link = require('react-router').Link;
var UserActions = require('./../actions/UserActions');


var Uploader = React.createClass({
  getInitialState: function(){
    return {percent : 100}
  },
  componentDidMount: function(){
    UserActions.progress.listen(this.progress);
  },
  progress:function(val){
    if(this.timeout){
      clearTimeout(this.timeout);
    }
    var _this = this;
    this.setState({percent: val});
    this.timeout = setTimeout(function(){
      _this.setState({percent: 100});
      setTimeout(function(){UserActions.reloadData();},1500)

    },500);

  },
  render: function(){
    return (

      <div id="bar-2" style={{display:this.state.percent<99?"block":"none"}} className="bar-main-container emerald">
      <div className="wrap">
        <div className="bar-percentage" data-percentage="62">{Math.round(this.state.percent)+"%"}</div>
        <div className="bar-container">
          <div style={{width:this.state.percent+"%"}} className="bar"></div>
        </div>
      </div>
      </div>
    );
  }
});
module.exports = Uploader;
