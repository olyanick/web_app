/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	sendMessage: function(req,res){
    var newMsg = req.body;
    newMsg.sender = req.user.id;
    Message.create(newMsg, function (err,msg) {
      if(err){
        throw err;
      }
      res.json(msg);
      Message.findOne({id:msg.id}).populate("sender").populate("dialog").exec(function(err,msg){
        if(err){
          throw err;
        }
        sails.sockets.broadcast("dialog"+msg.dialog.id, "newMessage", msg);

      });

    })
  },
  type: function(req,res){
    sails.sockets.broadcast("dialog"+req.body.dialog, "typing", req.body);
  }
};

