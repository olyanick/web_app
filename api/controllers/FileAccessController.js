var async = require('async');
module.exports = {
  saveAccess: function(req,res){
    Files.update({id:req.body.id},{access:req.body.type},function(err,file){
      if(err) throw err;
      if(req.body.type == "group"){
        FileAccess.destroy({file:req.body.id},function(err){
          if(err) throw err;
          async.each(req.body.groups, function(group,cb){
            FileAccess.create({file:req.body.id,group:group},function(err, group){
              if(err) throw err;
              cb()
            });
          },function(err){
            res.json({ok:"ok"});
          });
        })

      } else {
        res.json({ok:"ok"})
      }
    });
  }
};
