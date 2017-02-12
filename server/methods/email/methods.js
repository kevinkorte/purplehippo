Meteor.methods({
  inviteUser: function(email) {
    check(email, String);
    let user = Accounts.createUser({email: email});
    if (user) {
      Accounts.sendEnrollmentEmail(user)
    }
  }
});
