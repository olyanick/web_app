/**
* Schedule.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    user:{
      model:"user"
    },
    text:{
       type:"string"
     },
    details:{
      type:"string"
    },
    complete:{
      type:"boolean",
      defaultsTo: false
    },
     start_date:{
      type:"string"
    },
    end_date:{
      type:"string"
    }
  }
};

