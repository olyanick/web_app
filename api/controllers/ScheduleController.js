/**
 * ScheduleController
 *
 * @description :: Server-side logic for managing Schedules
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('underscore');
module.exports = {
	getSchedule:function(req,res){
    if(req.user.role == "worker"){
      Schedule.find({user:req.user.id}, function(err,schedule){
        if(err) throw err;
        _.map(schedule, function(item){
          if(!item.complete){
            item.color = "#FF3737";
          }
          return item;
        });
        res.json(schedule);
      });
    } else {
      Schedule.find({}, function(err,schedules){
        schedules = schedules.map(function(schedule){
          schedule.section_id = schedule.user;
          if(!schedule.complete){
            schedule.color = "#FF3737";
          }
          return schedule;
        });
        if(err) throw err;
        res.json(schedules);
      });
    }

  },
  addSchedule: function( req, res){
    var data ={
      start_date : req.body[req.body.ids+"_start_date"],
      end_date: req.body[req.body.ids+"_end_date"],
      text: req.body[req.body.ids+"_text"],
      details : req.body[req.body.ids+"_details"],
      user:req.body[req.body.ids+"_section_id"] || req.user.id,
      complete:req.body[req.body.ids+"_complete"]
    };



    if(req.body[req.body.ids+"_!nativeeditor_status"] == "updated"){
      Schedule.update({id:req.body[req.body.ids+"_id"]},data, function(err,schedule){
        if(err) throw err;
        res.json(schedule);
      });

    } else if(req.body[req.body.ids+"_!nativeeditor_status"] == "deleted"){
      Schedule.destroy({id:req.body[req.body.ids+"_id"]}, function(err,schedule){
        if(err) throw err;
        res.json(schedule);
      });
    } else {
      if(new Date().getTime() - req.session.lastAdd < 4000){
        req.session.lastAdd = new Date().getTime();
        console.log('reject)))');
        return;
      }
      req.session.lastAdd = new Date().getTime();
      Schedule.create(data, function(err,schedule){


        if(err) throw err;
        res.json(schedule);
      });
    }

  }
};

