{"filter":false,"title":"bootstrap.js","tooltip":"/config/bootstrap.js","undoManager":{"mark":0,"position":0,"stack":[[{"start":{"row":12,"column":0},"end":{"row":31,"column":5},"action":"insert","lines":["  var  companyRootFolder = {","    user:-1,","    parent:0,","    name:\"Общие файлы\",","    type:'folder'","  };","  Files.findOne({parent:0}, function (err, root) {","    if(err){","      cb();","      return;","    }","    if(!root){","      Files.create(companyRootFolder,function(err){","        cb();","        return;","      })","    } else {","      cb();","    }","  });"],"id":2,"ignore":true},{"start":{"row":34,"column":0},"end":{"row":35,"column":0},"action":"remove","lines":["  cb();",""]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":0,"column":0},"end":{"row":0,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1456669301765,"hash":"7edc9ed2e2cac5e83ee7bb81a4be91c987660a74"}