Template.settings.helpers({
  user() {
    if (Meteor.user()) {
      return Meteor.user();
    }
  },
  passwordsDontMatch() {
    if (Session.get('passwordsDontMatch')) {
      return true;
    }
  },
  changePasswordError() {
    if (Session.get('changePasswordError')) {
      return Session.get('changePasswordError');
    }
  }
});

Template.settings.events({
  'submit .js-change-password'(event) {
    event.preventDefault();
    const target = event.target;
    const currentPassword = target.currentPassword.value;
    const newPassword = target.newPassword.value;
    const confirmPassword = target.confirmPassword.value;
    if (newPassword !== confirmPassword ) {
      Session.set('passwordsDontMatch', 'Passwords do not match');
    } else {
      Accounts.changePassword(currentPassword, newPassword, function(error) {
        if (error) {
          Session.set('passwordsDontMatch', null);
          Session.set('changePasswordError', error.reason);
        } else {
          $('.js-change-password').addClass('loading');
          Session.set('passwordsDontMatch', null);
          Session.set('changePasswordError', null);
          Meteor.call('sendChangedPasswordEmail', function(error) {
            if (error) {
              Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
            } else {
              $('.js-change-password').removeClass('loading');
              $('#resetPasswordModal').modal('hide');
              swal({
                title: "Password Successfully Changed",
                type: "success"
              });
            }
          });
        }
      });
    }
  },
  'click .js-dismiss-modal'() {
    Session.set('passwordsDontMatch', null);
    Session.set('changePasswordError', null);
  },
  'click .js-modal-close'() {
    Session.set('passwordsDontMatch', null);
    Session.set('changePasswordError', null);
  },
  'click .js-reset-password'() {
    console.log('forgot password');
    Meteor.call('sendRestPasswordEmail', function(error) {
      Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
    });
  }
});
