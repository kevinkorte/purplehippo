Template.resetPassword.events({
  'submit .resetPassword'(event) {
    event.preventDefault();
    $('.ui.js-btn-resetPassword').addClass('loading');
    const target = event.target;
    const email = target.email.value;
    let options = {};
    options.email = email;
    Accounts.forgotPassword(options, function(error, result) {
      if (error) {
        Session.set('errorReason', error.reason);
        $('.ui.js-btn-resetPassword').removeClass('loading');
      } else {
        $('.ui.js-btn-resetPassword').removeClass('loading');
        Session.set('errorReason', null);
        Bert.alert('A password reset email has been sent to you!', 'success', 'fixed-top', 'fa-check');
      }
    })
  }
});

Template.resetPassword.helpers({
  hasLoginError() {
    if (Session.get('errorReason')) {
      return Session.get('errorReason');
    }
  }
});
Template.setInitalPassword.helpers({
  hasLoginError() {
    if (Session.get('errorReason')) {
      return Session.get('errorReason');
    }
  }
});

Template.setNewPassword.helpers({
  hasLoginError() {
    if (Session.get('errorReason')) {
      return Session.get('errorReason');
    }
  }
})
