var async = require('async');

module.exports = {
  addGroup: function (req, res) {
    Group.create({name: req.body.name, user: req.user.id}, function (err, group) {
      if (err) throw err;
      async.each(req.body.members,
        function (member, cb) {
          GroupMember.create({user: member, group: group.id}, function (err, member) {
            if (err) throw err;
            cb();
          })
        },
        function (err) {
          Group.findOne({id: group.id}).populate('members').exec(function (err, group) {
            if (err) throw err;
            res.json(group);
          });

        });
    });
  },
  getGroups: function (req , res) {
    if(!req.user){return res.json({err:"err"})}
    Group.find({user: req.user.id}).populate('members').exec(function (err, groups) {
      if (err) throw err;
      res.json(groups);
    });
  },
  updateGroup: function (req, res) {
    Group.update({id: req.body.id}, {name: req.body.name}, function (err, group) {
      if (err) throw err;
      GroupMember.destroy({group:req.body.id},function(err){
        if(err) throw err;
        async.each(req.body.members,
          function (member, cb) {
            GroupMember.create({user: member, group: req.body.id}, function (err, member) {
              if (err) throw err;
              cb();
            })
          },
          function (err) {
            Group.findOne({id: group.id}).populate('members').exec(function (err, group) {
              if (err) throw err;
              res.json({ok:"ok"});
            });

          });
      });

    });
  },
  deleteGroup: function(req, res){
    Group.destroy({id:req.body.id},function(err){
      if (err) throw err;
      GroupMember.destroy({group:req.body.id},function(err){
        if (err) throw err;
        res.json({ok:"ok"});
      })
    })
  }

};

