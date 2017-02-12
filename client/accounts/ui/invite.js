Template.invite.helpers({
  canAddMoreUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      return user.subscription.plan.used < user.subscription.quantity;
    }
  },
  numUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      return user.subscription.plan.used;
    }
  },
  maxUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      return user.subscription.quantity;
    }
  }
});

Template.invite.events({
  'submit .inviteUser'(event) {
    event.preventDefault();
    const target = event.target;
    const email = target.email.value;
    Meteor.call('inviteUser', email, function(error, response) {
      if (error) {
        console.log(error.reason);
      } else {
        console.log(response);
      }
    })
  }
})
