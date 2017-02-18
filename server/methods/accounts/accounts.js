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
  }
})
