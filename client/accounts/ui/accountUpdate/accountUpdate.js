Template.accountUpdate.helpers({
  errorReason: function() {
    return Session.get('errorReason');
  },
  email: function() {
    if (Meteor.user()) {
      return Meteor.user().emails[0].address;
    }
  }
});

Template.accountUpdate.events({
  'submit .accountUpdate'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const oldEmail = Meteor.user().emails[0].address;
    console.log(email, oldEmail);
    Meteor.call('updateUserToOwnOrganization', email, oldEmail, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        console.log(result);
      }
    });
  }
});
