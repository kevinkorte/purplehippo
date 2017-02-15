Template.invite.helpers({
  canAddMoreUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        return organization.quantityUsed < organization.quantity;
      }
    }
  },
  numUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    let organization = Organizations.findOne(user.organizationId);
    if (organization) {
      return organization.quantityUsed;
    }
  },
  maxUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    let organization = Organizations.findOne(user.organizationId);
    if (organization) {
      return organization.quantity;
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
