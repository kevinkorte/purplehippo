Template.login.events({
  'submit .login'(event) {
    event.preventDefault();
    const target = event.target;
    const email = target.loginEmail.value;
    const password = target.loginPassword.value;
    Meteor.loginWithPassword(email,password, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        Meteor.call('checkLoginStatus', email, function(error, result) {
          if (error) {
            console.log(error.reason);
            Session.set('errorReason', error.reason);
            FlowRouter.go('accountUpdate');
          } else {
            FlowRouter.go('dashboard');
          }
        });
      }
    });
  }
})
