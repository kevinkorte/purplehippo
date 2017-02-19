Meteor.methods({
  revokeInvite: function(id) {
    let user = Meteor.users.findOne(id);
    Meteor.users.remove({_id: id}, function (error, response) {
      if (error) {
        console.log(error.reason);
      } else {
        Organizations.update(user.organizationId, {$inc: {quantityUsed: -1}});
      }
    });
  },
  firstLogin: function() {
    Meteor.users.update(Meteor.userId(), {$inc: {loginCount: 1}, $set: {lastLogin: new Date, ip: this.connection.clientAddress}});
  },
  removeAccount: function(id) {
    let user = Meteor.users.findOne(id);
    Meteor.users.update(id, {$set: {accountActive: false}});
  }
})
