if (Meteor.isClient) {
  Accounts.onEnrollmentLink(function(token,done){
    FlowRouter.go('setInitalPassword');
    let user = Meteor.users.find({_id: this.userId});
    Template.setInitalPassword.events({
      'submit .setPassword'(event) {
        event.preventDefault();
        const target = event.target;
        const password = target.password.value;
        const vfyPassword = target.passwordVerify.value;
        if (password != vfyPassword) {
          Session.set('errorReason', "Passwords do not match");
        } else {
          Accounts.resetPassword(token, password, function(error, result) {
            if (error) {
              console.log(error.reason);
              FlowRouter.go('revokedAccess');
            } else {
              Meteor.call('firstLogin');
              FlowRouter.go('dashboard');
              done();
            }
          });
        }
      }
    });
  });
  Accounts.onResetPasswordLink(function(token, done) {
    FlowRouter.go('setNewPassword');
    Template.setNewPassword.events({
      'submit .js-setNewPassword'(event) {
        event.preventDefault();
        const target = event.target;
        const password = target.password.value;
        const confirmPassword = target.confirmPassword.value;
        if (password != confirmPassword) {
          Session.set('errorReason', "Passwords do not match");
        } else {
          Accounts.resetPassword(token, password, function(error, result) {
            if (error) {
              Session.set('errorReason', error.reason);
            } else {
              Session.set('errorReason', null);
              FlowRouter.go('dashboard');
              done();
            }
          });
        }
      }
    });
  });
};

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action: function() {
    if (Meteor.userId()) {
      BlazeLayout.render('dashboard');
    } else {
      FlowRouter.go('main');
    }
  }
});

FlowRouter.route('/', {
  name: 'main',
  action: function() {
    if (Meteor.userId()) {
      FlowRouter.go('dashboard');
    } else {
      BlazeLayout.render('main');
    }
  }
});
FlowRouter.route('/account-options', {
  name: 'revokedAccess',
  triggersEnter: [function(context, redirect) {
    $('body').addClass('account-options');
  }],
  triggersExit: [function(context, redirect) {
    $('body').removeClass('account-options');
  }],
  action: function() {
    if (Meteor.userId()) {
      BlazeLayout.render('revokedAccess')
    } else {
      FlowRouter.go('main');
    }
  }
});
FlowRouter.route('/account-update', {
  name: 'accountUpdate',
  triggersEnter: [function(context, redirect) {
    $('body').addClass('account-update');
  }],
  triggersExit: [function(context, redirect) {
    $('body').removeClass('account-options');
  }],
  action: function() {
    if (Meteor.userId()) {
      BlazeLayout.render('accountUpdate');
    } else {
      FlowRouter.go('main');
    }
  }
});
FlowRouter.route('/account/manage/users', {
  name: 'manageUsers',
  triggersEnter: [function(context, redirect) {
    let user = Meteor.users.findOne(Meteor.userId());
      if (user) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'], user.organizationId)) {
          FlowRouter.go('manageAccount');
        }
      }
  }],
  action: function() {
    BlazeLayout.render('manage', {content: 'invite'});
  }
});
FlowRouter.route('/account/manage', {
  name: 'manageAccount',
  action: function() {
    if (Meteor.userId()) {
      BlazeLayout.render('manage', {content: 'settings'});
    } else {
      FlowRouter.go('main');
    }
  }
});
FlowRouter.route('/account/manage/payment', {
  name: 'managePayment',
  triggersEnter: [function(context, redirect) {
    let user = Meteor.users.findOne(Meteor.userId());
      if (user) {
        if (!Roles.userIsInRole(Meteor.userId(), ['admin'], user.organizationId)) {
          FlowRouter.go('manageAccount');
        }
      }
  }],
  action: function() {
      BlazeLayout.render('manage', {content: 'payment'});
  }
});
FlowRouter.route('/account/add-follower', {
  name: 'addFollower',
  action: function() {
    if (Meteor.userId()) {
      BlazeLayout.render('manage', {content: 'addFollower'});
    } else {
      FlowRouter.go('main');
    }

  }
});
FlowRouter.route('/setpassword', {
  name: 'setInitalPassword',
  triggersEnter: [function(context, redirect) {
    $('body').addClass('set-password');
  }],
  triggersExit: [function(context, redirect) {
    $('body').removeClass('set-password');
  }],
  action: function() {
    BlazeLayout.render('setInitalPassword');
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action: function() {
    BlazeLayout.render('login');
  }
});
FlowRouter.route('/reset-password', {
  name: 'resetPassword',
  action: function() {
    BlazeLayout.render('resetPassword');
  }
});
FlowRouter.route('/set-new-password', {
  name: 'setNewPassword',
  action: function() {
    BlazeLayout.render('setNewPassword')
  }
});
FlowRouter.route('/:author/:id/edit', {
  name: 'editViewing',
  triggersEnter: function(context, params) {
    $('body').addClass('viewing');
    let author = FlowRouter.current().params.author;
    if (Meteor.userId() == author) {

        BlazeLayout.render('viewingLayout');

    } else {
      BlazeLayout.render('publicViewingLayout');
    }
  },
  triggersExit: function() {
    Session.set("agent", null);
  },
});

FlowRouter.route('/:author/:id', {
  name: 'publicViewings',
  triggersEnter: [function(context, redirect) {
    $('body').addClass('viewing');
  }],
  triggersExit: [function(context, redirect) {
    $('body').removeClass('viewing');
  }],
  action: function() {
    BlazeLayout.render('publicViewingLayout');
  }

});
