/**
 * ContactController
 *
 * @description :: Server-side logic for managing Contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getContacts: function (req, res) {
    if(!req.user){
      res.end();
      return;
    }
    Contact.find({sender: req.user.id, status: "waiting"}).populate('receiver').exec(function (err, myInvites) {
      if (err) {
        throw err
      }
      var ignoredIds = [];
      for (var i = 0; i < myInvites.length; i++) {
        ignoredIds.push(myInvites[i].receiver.id);
      }
      ignoredIds.push(req.user.id);
      Contact.find({receiver: req.user.id, status: "waiting"}).populate('sender').exec(function (err, invitesOfMe) {
        for (var i = 0; i < invitesOfMe.length; i++) {
          ignoredIds.push(invitesOfMe[i].sender.id);
        }
        if (err) {
          throw err
        }

        Contact.find({
          or: [{receiver: req.user.id}, {sender: req.user.id}],
          status: "accepted",
        }).populate('sender').populate('receiver')
          .exec(function (err, contactsList) {
            var contacts = [];
            for (var i = 0; i < contactsList.length; i++) {
              var contact = {};
              var id;
              if (contactsList[i].receiver.id == req.user.id) {
                id = contactsList[i].sender.id;
                contact = contactsList[i].sender;
                contact.user_id = id;
                ignoredIds.push(contact.id);
                contact.id = contactsList[i].id;

              }
              if (contactsList[i].sender.id == req.user.id) {
                id = contactsList[i].receiver.id;
                contact = contactsList[i].receiver;
                contact.user_id = id;
                ignoredIds.push(contact.id);
                contact.id = contactsList[i].id;

              }
              contacts.push(contact);
            }
            User.find({id: {'!': ignoredIds}}, function (err, notInContacts) {
              if (err) {
                throw err
              }
              res.json({
                notInContacts: notInContacts,
                myInvites: myInvites,
                invitesOfMe: invitesOfMe,
                contacts: contacts
              });
            });
          })

      })
    })
  },
  inviteContact: function (req, res) {

    Contact.find({receiver:req.user.id,sender:req.body.id},function(err,contact){
      if (err) {
        throw err
      }
      if(contact.length>0){
        contact[0].status = "accepted";
        contact[0].save(function(err,contact){
          res.json(contact);
        });
      } else {
        Contact.create({
          sender: req.user.id,
          receiver: req.body.id
        }, function (err, contact) {
          if (err) {
            throw err
          }
          res.json(contact);
          User.findOne({id: req.body.id},function(err,send){
            sails.sockets.blast("contactInvite",{user:send.id,name:send.name});
          });

        })
      }

    });

  },
  acceptContact: function (req, res) {
    var id = req.param("id");
    Contact.update({id: id}, {status: "accepted"}, function (err, contact) {
      if (err) {
        throw err
      }
      contact = contact[0];
      Dialog.create({creator: 0,type:"single",contact:id},function(err,dialog){
        if(err){
          throw err;
        }
        DialogMember.create({dialog:dialog.id,user:contact.receiver}).populate("user").exec(function(err,user1){
          if(err){
            throw err;
          }
          DialogMember.create({dialog:dialog.id,user:contact.sender}).populate("user").exec(function(err,user2){
            if(err){
              throw err;
            }
            res.json({
              dialog:dialog,
              member1:user1,
              member2:user2
            });
            var send = user1 == req.user.id?user1:user2;
            User.find({id:send.user},function(err,send){
              if(err){
                throw err;
              }
              sails.sockets.blast("contactCreated",{user:send[0].id,name:send[0].name});
            });

          })
        })
      });

    });
  },
  declineContact: function (req, res) {
    var id = req.param("id");
    Contact.findOne({id:id}).populate('sender').populate('receiver').exec(function(err,contact){
      var send = contact.sender.id == req.user.id ? contact.receiver : contact.sender;
      if(contact.status == "accepted"){
        Contact.destroy({id:id}, function (err) {
          if (err) {
            throw err
          }
          Dialog.findOne({contact:id},function(err,dialog){
            var dialogId = dialog.id;
            Dialog.destroy({id:dialogId},function(err){
              if(err){
                throw err;
              }
              DialogMember.destroy({dialog:dialogId},function(err){
                if(err){
                  throw err;
                }
                Message.destroy({dialog:dialogId},function(err){
                  if(err){
                    throw err;
                  }
                  res.json({ok:"ok"});
                  sails.sockets.blast("contactInviteDecline",{users:[send.id],active:true ,name:req.user.name});
                });

              });

            })
          });

        });
      } else {
        Contact.destroy({id:id}, function (err) {
          if (err) {
            throw err
          }
          sails.sockets.blast("contactInviteDecline",{users:[contact.sender,contact.receiver],active:false});
          res.json({ok:"ok"})
        });
      }

    });

  }
};

