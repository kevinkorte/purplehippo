if (Meteor.isClient) {
  Accounts.onEnrollmentLink(function(token,done){
    FlowRouter.go('setInitalPassword');
    let user = Meteor.users.find({_id: this.userId});
    console.log(Meteor.userId());
    Template.setInitalPassword.events({
      'submit .setPassword'(event) {
        event.preventDefault();
        const target = event.target;
        const password = target.password.value;
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
    });
  });
}

FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('main');
  }
});
FlowRouter.route('/account-options', {
  name: 'revokedAccess',
  action: function() {
    BlazeLayout.render('revokedAccess')
  }
});
FlowRouter.route('/account-update', {
  name: 'accountUpdate',
  action: function() {
    BlazeLayout.render('accountUpdate');
  }
});
FlowRouter.route('/account/manage/users', {
  name: 'manageUsers',
  action: function() {
    BlazeLayout.render('dashboard', {content: 'invite'});
  }
});
FlowRouter.route('/account/manage/payment', {
  name: 'managePayment',
  action: function() {
    BlazeLayout.render('manage', {content: 'payment'});
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

FlowRouter.route('/:author/:id', {
  name: 'viewings',
  triggersEnter: function(context, params) {
    let author = FlowRouter.current().params.author;
    if (Meteor.userId() == author) {
      //BlazeLayout.render('eventLayout');
    } else {
      BlazeLayout.render('publicEventLayout');
    }
  },
  triggersExit: function() {
    Session.set("agent", null);
  },
  action() {
    BlazeLayout.render('viewingLayout');
  }
});
