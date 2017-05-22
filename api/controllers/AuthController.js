var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function(req, res) {

    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        return res.send({
          message: info.message
        });
      }
      req.logIn(user, function(err) {
        if (err) res.send(err);
        User.update({id:req.user.id},{online:'online'},function(err,user){
          if(err){throw err}
          return res.send(user[0]);
        });

      });

    })(req, res);
  },

  logout: function(req, res) {
    var id = req.user.id;
    req.logout();
    User.update({id:id},{online:"offline"},function(err,user){

    });
    res.json({false:false});
  },
  getLogined: function(req, res){
    if(req.user){
      res.json(req.user);
    } else {
      res.json({
        false:false
      })
    }
  }
};
