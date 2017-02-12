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
