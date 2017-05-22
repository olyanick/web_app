

module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'post /login': 'AuthController.login',
  '/logout': 'AuthController.logout',


  'get /user':"AuthController.getLogined",
  'get /users':"UserController.getUsers",
  'post /user':'UserController.register',
  'put /user':"UserController.update",
  'put /users':"UserController.updateUser",
  "post /user/subscribe":"UserController.subscribeUser",

  'get /contacts':"ContactController.getContacts",
  'post /contacts':"ContactController.inviteContact",

  'post /contacts/:id':"ContactController.acceptContact",
  'delete /contacts/:id':"ContactController.declineContact",


  'get /dialogs':"DialogController.getDialogs",
  'post /dialogs':"DialogController.createDialog",
  'post /dialogs/subscribe':"DialogController.subscribe",
  'delete /dialogs':"DialogController.deleteDialog",

  "post /message":"MessageController.sendMessage",
  "post /message/typing":"MessageController.type",
  "delete /member":"DialogMemberController.deleteMember",
  "post /member":"DialogMemberController.addMember",

  "/user/watchUser": "UserController.watchUser",
  "/user/subscribe": "UserController.subscribeUser",


  "/files": "FilesController.getFiles",
  "/files/save": "FilesController.saveFile",
  "/files/branch" : "FilesController.getChildren",
  "/files/update" : "FilesController.updateFile",
  "/files/download" : "FilesController.getFile",
  "/files/userfiles/:id": "FilesController.getFile",
  "/files/search": "FilesController.getChildren",
  "/files/delete": "FilesController.deleteFile",

  "/public_files": "PublicFilesController.getFiles",
  "/public_files/save": "PublicFilesController.saveFile",
  "/public_files/branch" : "PublicFilesController.getChildren",
  "/public_files/update" : "PublicFilesController.updateFile",
  "/public_files/download" : "PublicFilesController.getFile",
  "/public_files/userfiles/:id": "PublicFilesController.getFile",
  "/public_files/search": "PublicFilesController.getChildren",
  "/public_files/delete": "PublicFilesController.deleteFile",

  "get /schedule" :"ScheduleController.getSchedule",
  "post /schedule" :"ScheduleController.addSchedule",

  "post /group" :"GroupController.addGroup",
  "get /group" :"GroupController.getGroups",
  "delete /group" :"GroupController.deleteGroup",
  "put /group" :"GroupController.updateGroup",

  "post /access" :"FileAccess.saveAccess",

  "post /checkemail":"UserController.checkEmail"



};
