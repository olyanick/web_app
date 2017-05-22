/**
* Dialog.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    creator:{
      model:"user"
    },
    messages:{
      collection: 'message',
      via: 'dialog'
    },
    members:{
      collection: 'dialogMember',
      via: 'dialog'
    },
    type:{
      type: 'string',
      defaultsTo:'group',
      enum:['group','single']
    },
    contact:{
      model:'contact'
    },
    name:{
      type:"string"
    },
    avatar:{
      type:"text",
      defaultsTo:'images/group.png'
    }
  }
};

