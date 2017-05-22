

var passport = require('passport');

module.exports = {
  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },
	register: function(req, res){

    User.findOne({email:req.body.email},function(err,user){
      if(err){ throw err}
      if(user){
        res.json({
          message:"user exists",
          user:req.user
        })
      } else {
        User.create(req.body).exec(function(err,user){
          if(err){throw err}
          passport.authenticate('local', function(err, user, info) {
            if ((err) || (!user)) {
              return res.send({
                message: info.message,
              });
            }
            req.logIn(user, function(err) {
              if (err) res.send(err);
              User.update({id:req.user.id},{online:'online'},function(err,user){
                if(err){throw err}
                User.publishCreate(user[0]);
                return res.send(user[0]);
              });
            });

          })(req, res);


        })
      }
    });
  },
  update: function(req, res){
    if(req.user){
      User.update({id:req.user.id},req.body,function(err, user){
        if(err){throw err}
        res.json(user[0]);
        sails.sockets.blast("updateUser", user[0]);
      })
    } else {
      res.json({msg: "You must be loggined"});
    }
  },
  updateUser: function(req, res){
      User.update({id:req.body.id},req.body,function(err, user){
        if(err){throw err}
        res.json(user[0]);
        sails.sockets.blast("updateUser", user[0]);
      })
  },
  watchUser:function (req,res) {
    // watch for new User instances
    User.watch(req.socket);

    console.log( 'User watching ' + req.socket.id );

  },
  subscribeUser:function(req,res){
    sails.sockets.join(req.socket, "user" + req.body.id);
    console.log( 'User subscribed '+"user" + req.body.id+ "  " + req.socket.id );
  },
  getUsers: function(req,res){
    if(!req.user){return res.json({err:"err"})}
    User.find({id:{"!":req.user.id}},function(err,users){
      if(err) throw err;
      res.json(users);
    })
  },
  checkEmail: function(req,res){
    User.find({email:req.body.email},function(err,users){
      if(err) throw err;
      if(users.length>0){
        res.json({exists: true});
      } else {
        res.json({exists: false});
      }
    });
  }

};

