if (Meteor.isClient) {
  Accounts.onEnrollmentLink(function(token,done){
    FlowRouter.go('setInitalPassword');
    Template.setInitalPassword.events({
      'submit .setPassword'(event) {
        event.preventDefault();
        console.log(event);
        const target = event.target;
        const password = target.password.value;
        Accounts.resetPassword(token, password, function(error, response) {
          if (error) {
            console.log(error.reason);
          } else {
            FlowRouter.go('dashboard');
            done();
          }
        });
      }
    });
  });
}

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('main');
  }
});
FlowRouter.route('/account/manage/users', {
  name: 'manageUsers',
  action: function() {
    BlazeLayout.render('account', {content: 'invite'});
  }
});
FlowRouter.route('/setpassword', {
  name: 'setInitalPassword',
  action: function() {
    BlazeLayout.render('setInitalPassword');
  }
});

FlowRouter.route('/dashboard', {
  name: 'dashboard',
  action: function() {
    BlazeLayout.render('dashboard');
  }
});

FlowRouter.route('/login', {
  name: 'login',
  action: function() {
    BlazeLayout.render('login');
  }
});
