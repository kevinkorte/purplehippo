FlowRouter.route('/account/invite', {
  action: function() {
    BlazeLayout.render('account', {content: 'invite'});
  }
});
