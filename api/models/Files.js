/**
* File.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    user:{
      model:"user"
    },
    parent: {
      model: 'files',
      defaultsTo:0
    },
    name:{
      type:"string"
    },
    type:{
      type:"string",
      enum:['folder','doc','excel','pdf','pp','text','video','image','code','audio','archive','file'],
      defaultsTo:"folder"
    },
    access:{
      type:"string",
      enum:['public','private','group'],
      defaultsTo:"private"
    },
    download_link:{
      type:"string"
    },
    size:{
      type: "int"
    },
    children:{
      collection: 'files',
      via: 'parent'
    },
    groups:{
      collection: 'fileAccess',
      via: 'file'
    }
  }
};

