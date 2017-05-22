module.exports = {
  attributes: {
    name: {
      type: "string"
    },
    user: {
      model: "user"
    },
    members: {
      collection: "groupMember",
      via: "group"
    }
  }
};
