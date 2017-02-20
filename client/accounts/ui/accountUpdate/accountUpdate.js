Template.accountUpdate.helpers({
  errorMessage: function() {
    return Session.get('errorMessage');
  }
});

Template.accountUpdate.events({
  'submit .accountUpdate'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const oldEmail = Session.get('email');
    Meteor.call('addEmail', email, oldEmail, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        console.log(result)
      }
    });
  }
});
