Template.login.events({
  'submit .login'(event) {
    event.preventDefault();
    $('.ui.js-btn-login').addClass('loading');
    const target = event.target;
    const email = target.loginEmail.value;
    const password = target.loginPassword.value;
    Meteor.loginWithPassword(email,password, function(error, result) {
      if (error) {
        Session.set('errorReason', error.reason);
        $('.ui.js-btn-login').removeClass('loading');
      } else {
        Meteor.call('checkLoginStatus', email, function(error, result) {
          if (error) {
            console.log(error.reason);
            Session.set('errorReason', error.reason);
            FlowRouter.go('accountUpdate');
            $('.ui.js-btn-login').removeClass('loading');
          } else {
            $('.ui.js-btn-login').removeClass('loading');
            Session.set('errorReason', null);
            FlowRouter.go('dashboard');

          }
        });
      }
    });
  }
});

Template.login.helpers({
  hasLoginError() {
    if (Session.get('errorReason')) {
      return Session.get('errorReason');
    }
  }
})
