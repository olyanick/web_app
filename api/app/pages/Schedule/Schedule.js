var React = require('react');
var Link = require('react-router').Link;

var ProfileStore = require('../../stores/ProfileStore');

var Schedule = React.createClass({
  getInitialState: function(){
    return ({profile:{
      user:{}
    }})
  },
  componentDidMount: function(){
    this.unsubscribe = ProfileStore.listen(this.update);
    this.update();
  },
  update: function(){
     this.setState({profile:ProfileStore.getData()});
    var _this = this;
    setTimeout(function(){
      scheduler.config.xml_date = "%Y-%m-%d %H:%i";
      scheduler.config.prevent_cache = true;
      scheduler.config.first_hour = 4;
      scheduler.config.limit_time_select = true;
      scheduler.locale.labels.section_location = "Место";
      scheduler.locale.labels.section_complete = "Выполнено";
      scheduler.config.details_on_create = true;
      scheduler.config.details_on_dblclick = true;
      scheduler.config.prevent_cache = true;


      var profile = ProfileStore.getData();
      if(profile.user.role !=="worker"){
        var sections=[];
        profile.users.map(function(user){
          sections.push({key:user.id,label:user.name});
        });

        scheduler.locale.labels.unit_tab = "Работники";
        scheduler.locale.labels.section_custom="Назначено:";
        scheduler.templates.event_class=function(s,e,ev){ return ev.custom?"custom":""; };
        scheduler.config.lightbox.sections=[
          { name:"complete", map_to:"complete", type:"checkbox", unchecked_value:false,height:40 },
          {name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
          {name:"custom", height:23, type:"select", options:sections, map_to:"section_id" },
          {name:"location", height:43, type:"textarea", map_to:"details" },

          {name:"time", height:72, type:"time", map_to:"auto"}
        ];

        scheduler.createUnitsView("unit","section_id",sections);

        scheduler.init('scheduler_here',new Date(),"unit");
        scheduler.load("schedule", "json");
        var dp = new dataProcessor("schedule");
        dp.init(scheduler);
        _this.unsubscribe();
      } else if(profile.user.role =="worker"){
        scheduler.config.lightbox.sections = [
          { name:"complete", map_to:"complete", unchecked_value:false,type:"checkbox", height:40 },
          {name:"description", height:130, map_to:"text", type:"textarea" , focus:true},
          {name:"location", height:43, type:"textarea", map_to:"details" },

          {name:"time", height:72, type:"time", map_to:"auto"}
        ];

        scheduler.init('scheduler_here', new Date(), "day");
        scheduler.load("schedule", "json");
        var dp = new dataProcessor("schedule");
        dp.init(scheduler);

      }
      _this.unsubscribe();
    },600);
  },
  render: function(){
    var _this = this;
    var unit = function(){
      if(_this.state.profile.user.role &&_this.state.profile.user.role != "worker"){
        return(<div className="dhx_cal_tab" name="unit_tab" style={{left:277}}></div>);
      }
    }();
    return (
      <div id="scheduler_here" className="dhx_cal_container" style={{width:"100%"}}>
        <div className="dhx_cal_navline">
          <div className="dhx_cal_prev_button">&nbsp;</div>
          <div className="dhx_cal_next_button">&nbsp;</div>
          <div className="dhx_cal_today_button"></div>
          <div className="dhx_cal_date"></div>
          <div className="dhx_cal_tab" name="day_tab" style={{right:204}}></div>
          <div className="dhx_cal_tab" name="week_tab" style={{right:140}}></div>
          <div className="dhx_cal_tab" name="month_tab" style={{right:76}}></div>
          <div className="dhx_cal_tab" name="year_tab" style={{left:193}}></div>
          {unit}
        </div>
        <div className="dhx_cal_header">
        </div>
        <div className="dhx_cal_data">
        </div>
      </div>
    );
  }
});
module.exports = Schedule;
