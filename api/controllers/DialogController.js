var async = require('async');
var _ = require('underscore');
module.exports = {
  getDialogs: function (req, res) {
    if(!req.user){return}
    membersArr = [];
    DialogMember
      .find({user: req.user.id})
      .populate('dialog')
      .exec(function (err, members) {
        if(!members){res.badRequest()}
        async.each(members, function (member, cb) {
          member.dialog.creator = member.dialog.creator == req.user.id;
          Message.find({
            "dialog": member.dialog.id
          })
            .populate('sender')
            .exec(function (err, messages) {
              member.dialog.msg = messages;

              DialogMember.find({dialog: member.dialog.id, user: {"!": req.user.id}})
                .populate('user')
                .exec(function (err, members) {
                  if (err) {
                    throw err;
                  }
                  member.dialog.membrs = members;
                  membersArr.push(member);
                  cb();
                });

            })
        }, function (err) {
          res.json(membersArr);
        });

      })
  },
  createDialog: function (req, res) {
    var dialog = req.body;
    dialog.creator = req.user.id;
    var memb = _.clone(dialog.members);
    dialog.members.push(req.user.id);
    Dialog.create(dialog, function (err, dialog) {
      if (err) {
        throw err;
      }
      async.each(req.body.members, function (member, cb) {
          DialogMember.create({dialog: dialog.id, user: member}, function (err, member) {
            if (err) {
              throw  err;
            }
            cb();
          });
        },
        function () {
          res.json(dialog);
          sails.sockets.blast("dialogCreated", {members: memb, name: dialog.name});

        });
    });
  },
  subscribe: function (req, res) {
    _.each(req.body.dialogs, function (elem) {
      sails.sockets.join(req.socket, "dialog" + elem);
    });
  },
  deleteDialog: function (req, res) {
    Dialog.findOne({id: req.body.dialog.dialog.id}, function (err, dialog) {
      var dialogId = dialog.id;
      if (dialog.creator != req.user.id) {
        res.end({"msg": "nice try"})
      }
      DialogMember.destroy({dialog: dialogId}, function (err) {
        if (err) {
          throw err;
        }
        Dialog.destroy({id: dialogId}, function (err) {
          if (err) {
            throw err;
          }
          Message.destroy({dialog: dialogId}, function (err) {
            if (err) {
              throw err;
            }
            res.json({ok: "ok"});
            sails.sockets.broadcast("dialog" + dialogId, "dialogDelete", dialog);
          });

        });

      })
    });
  }
};

