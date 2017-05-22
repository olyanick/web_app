
module.exports = {

  attributes: {
    sender: {
      model: 'User'
    },
    receiver: {
      model: 'User'
    },
    status: {
      type: 'string',
      defaultsTo: 'waiting',
      enum:['waiting','accepted']
    }
  }
};

