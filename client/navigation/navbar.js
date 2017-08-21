Template.navbar.events({
  'click .logout'(event) {
    event.preventDefault();
    Meteor.logout(function() {
      FlowRouter.go('main')
    })
  }
});
