Template.invite.helpers({
  canAddMoreUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    return user.subscription.plan.used < user.subscription.quantity;
  }
});

Template.invite.events({
  'submit .inviteUser'(event) {
    event.preventDefault();
    console.log(event);
  }
})
