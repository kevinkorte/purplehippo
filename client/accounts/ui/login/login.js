Template.login.events({
  'submit .login'(event) {
    event.preventDefault();
    const target = event.target;
    const email = target.loginEmail.value;
    const password = target.loginPassword.value;
    Meteor.call('checkLoginStatus', email, function(error, result) {
      if (error) {
        Session.set('email', email);
        Session.set('errorMessage', error.reason);
        FlowRouter.go('accountUpdate');
      } else {
        Meteor.loginWithPassword(email,password, function(error, result) {
          if (error) {
            Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
          } else {
            Meteor.call('updateLoginInfo', email);
            FlowRouter.go('dashboard');
          }
        })
        //Login here
      }
    })
  }
})
