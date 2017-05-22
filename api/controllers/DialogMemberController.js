
module.exports = {
  deleteMember: function(req,res){
    var start;
    DialogMember.findOne(req.body).populate("user").populate("dialog").exec(function(err,member){
      if(err){
        throw err;
      }
      DialogMember.destroy(req.body,function(err){
        if(err){
          throw err;
        }
        res.json({ok:"ok"});
        sails.sockets.broadcast("user"+member.user.id, "deleteMemberMe", member);
        sails.sockets.broadcast("dialog"+member.dialog.id, "deleteMember", member );
      });

    });

  },
  addMember: function(req, res) {
    DialogMember.create(req.body,function(err,member){
      if(err){
        throw err;
      }
      res.json(member);
      DialogMember.findOne({id:member.id}).populate("user").populate("dialog").exec(function(err,member){
        if(err){
          throw err;
        }
        sails.sockets.broadcast("user"+member.user.id, "newMemberMe", member);
        sails.sockets.broadcast("dialog"+member.dialog.id, "newMember", member );
      });

    });
  }
};

