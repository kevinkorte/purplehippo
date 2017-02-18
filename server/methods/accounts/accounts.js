Meteor.methods({
  revokeInvite: function(id) {
    console.log('revoke invite');
    Meteor.users.remove({_id: id}, function (error, response) {
      if (error) {
        console.log(error.reason);
      }
    });
  }
})
