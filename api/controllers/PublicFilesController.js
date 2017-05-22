/**
 * FileController
 *
 * @description :: Server-side logic for managing Files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('underscore');
var async = require('async');
var path = require("path");
var fs = require('fs');
var mime = require('mime');
module.exports = {
  getFiles: function (req, res) {
    Files.find({user: -1, parent: 0}).populate("children").populate("groups").exec(function (err, files) {
      if (files.length == 0) {
        return res.negotiate(err);
      }
      files[0].value = files[0].name;
      files[0].date = files[0].createdAt;
      if (files[0].children.length > 0) {
        files[0].webix_branch = 1;
        files[0].webix_child_branch = 1;
      }
      res.json(files);
    });
  },
  saveFile: function (req, res) {
    if(req.user.role =="worker"){return res.badRequest("Access denied")}
    if (req.body.action == "create") {
      Files.create({
        name: req.body.source,
        parent: req.body.target,
        user: -1
      }, function (err, file) {
        file.value = file.name;
        file.date = file.createdAt;
        res.json(file);
        return;
      })
    } else {
      var _this = this;
      req.file('upload').upload({
        dirname: path.resolve(sails.config.appPath, 'files/userfiles/' + req.user.id + "/"),
        maxBytes: 1000000000,
        onProgress: function (par1, par2, par3, par4, par5) {
          sails.sockets.broadcast("user" + req.user.id, "uploading", par1.total * 100 / par1.stream.byteCount);
        }
      }, function whenDone(err, uploadedFiles) {
        if (err) {
          return res.negotiate(err);
        }

        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }
        if (!req.body.target) {
          Files.findOne({name: "uploads", user: -1}, function (err, uploads) {
            if (err) throw err;
            if (!uploads) {
              Files.findOne({user: -1, parent: 0}, function (err, root) {
                if (err) throw  err;
                Files.create({name: "uploads", user: -1, parent: root.id}, function (err, uploads) {
                  if (err) throw err;
                  var newFile = {
                    name: uploadedFiles[0].filename,
                    type: _this.getFileType(uploadedFiles[0].type),
                    download_link: uploadedFiles[0].fd,
                    size: uploadedFiles[0].size,
                    parent: uploads.id,
                    user: -1
                  };
                  Files.create(newFile, function (err, file) {
                    if (err) {
                      throw err;
                    }
                    file.value = file.name;
                    file.date = file.createdAt;
                    res.json(file);
                  });
                });
              });

            } else {
              var newFile = {
                name: uploadedFiles[0].filename,
                type: _this.getFileType(uploadedFiles[0].type),
                download_link: uploadedFiles[0].fd,
                size: uploadedFiles[0].size,
                parent: uploads.id,
                user: -1
              };
              Files.create(newFile, function (err, file) {
                if (err) {
                  throw err;
                }
                file.value = file.name;
                file.date = file.createdAt;
                res.json(file);
              });
            }
          })
        } else {
          var newFile = {
            name: uploadedFiles[0].filename,
            type: _this.getFileType(uploadedFiles[0].type),
            download_link: uploadedFiles[0].fd,
            size: uploadedFiles[0].size,
            parent: req.body.target,
            user: -1
          };
          Files.create(newFile, function (err, file) {
            if (err) {
              throw err;
            }
            file.value = file.name;
            file.date = file.createdAt;
            res.json(file);
          });
        }


      });
    }

  },
  getChildren: function (req, res) {
    var children = {
      parent: req.body.source,
      data: []
    };
    var name = '';
    if (req.body.text) {
      name = req.body.text;
    }
    Files.find({parent: req.body.source, name: {'like': '%' + name + '%'}}).populate("children").populate("groups").then(function (files) {
      return _.map(files, function (file) {
        file.value = file.name;
        file.date = file.createdAt;
        if (file.children.length > 0) {
          file.webix_branch = 1;
          file.webix_child_branch = 1;
        }
        children.data.push(file);
        return file;
      });
    }).spread(function (files) {
      res.json(children)
    }).catch(function (err) {
      throw err;
    })
  },
  getFileType(rawType){
    var type;
    switch (rawType) {
      case "text/plain":
        type = "text";
        break;
      case "image/png":
        type = "image";
        break;
      case "image/gif":
        type = "image";
        break;
      case "image/jpeg":
        type = "image";
        break;
      case "image/pjpeg":
        type = "image";
        break;
      case "image/svg+xml":
        type = "image";
        break;
      case "application/pdf":
        type = "pdf";
        break;
      case "application/javascript":
        type = "code";
        break;
      case "text/html":
        type = "code";
        break;
      case "text/css":
        type = "code";
        break;
      case "pplication/zip":
        type = "archive";
        break;
      case "application/gzip":
        type = "archive";
        break;
      case "audio/basic":
        type = "audio";
        break;
      case "audio/mp4":
        type = "audio";
        break;
      case "audio/mpeg":
        type = "audio";
        break;
      case "audio/ogg":
        type = "audio";
        break;

      case "application/vnd.ms-excel":
        type = "excel";
        break;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        type = "excel";
        break;
      case "application/msword":
        type = "doc";
        break;
      case "application/vnd.ms-powerpoint":
        type = "pp";
        break;
      case "video/avi":
        type = "video";
        break;
      case "video/mpeg":
        type = "video";
        break;
      case "video/mp4":
        type = "video";
        break;
      case "video/ogg":
        type = "video";
        break;
      case "video/x-flv":
        type = "video";
        break;
      default :
        type = "file";
        break;
    }
    return type;
  },
  updateFile: function (req, res) {
    if(req.user.role =="worker"){return res.badRequest("Access denied")}
    if (req.body.action == "rename") {
      Files.update({id: req.body.source}, {name: req.body.target}, function (err, file) {
        res.json(file);
      });
    }
    if (req.body.action == "move") {
      Files.update({id: req.body.source}, {parent: req.body.target}, function (err, file) {
        res.json(file);
      });
    }

  },
  downloadFile: function (req, res) {
    var i;
  },
  getFile: function (req, res) {
    var _this = this;
    var id = req.param("id").replace(/\D*/g, '');
    Files.findOne({id: id}, function (err, file) {
      if(err) throw err;
      if (!file) {
        return res.badRequest();
      }
      _this.fileSend(req,res,file);
    });

  },
  deleteFile: function (req, res) {
    if(req.user.role =="worker"){return res.badRequest("Access denied")}
    Files.findOne({id: req.body.source}, function (err, file) {
      if (file.type == "folder") {
        Files.destroy({id: req.body.source}, function (err, file) {
          if (err) throw err;
          res.ok();
        });
      } else {
        fs.exists(file.download_link, function (exists) {
          if (exists) {
            fs.unlink(file.download_link, function (err) {
              if (err) throw err;
              Files.destroy({id: req.body.source}, function (err, file) {
                if (err) throw err;
                res.ok();
              });
            });
          }
        });
      }

    });
  },
  fileSend:function(req,res,file){
    var link  = file.download_link;
    var name = file.name;
    fs.exists(file.download_link, function (exists) {
      if (exists) {
        var file = link;
        var mimetype = mime.lookup(file);

        res.setHeader('Content-disposition', 'attachment; filename=' + name);
        res.setHeader('Content-type', mimetype);

        var filestream = fs.createReadStream(file);
        filestream.pipe(res);
      } else {
        res.badRequest();
      }
    });
  }
};

