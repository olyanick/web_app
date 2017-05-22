var bcrypt = require('bcrypt-nodejs');

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    email:{
      type: 'string'
    },
    password:{
      type: 'string'
    },
    description:{
      type: 'text'
    },
    online:{
      type: 'string',
      defaultsTo:'offline',
      enum:['online','offline']
    },
    role:{
      type: 'string',
      defaultsTo:'worker',
      enum:['admin','manager','worker']
    },
    status:{
      type: 'string'

    },
    avatar:{
      type:'text',
      defaultsTo:'images/userpic.png'
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt,null, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          user.password = hash;
          cb();
        }
      });
    });
  },
  afterCreate: function(user, cb){
    Files.create({user:user.id,name:"Мои файлы"},function(err,file){
      if(err){
        throw err;
      }
      cb();
    });

  }
};

