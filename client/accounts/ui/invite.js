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
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        return organization.quantityUsed;
      }
    }
  },
  maxUsers: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        return organization.quantity;
      }
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
  },
  'click .add-more-users'(event) {
    event.preventDefault();
    $('.add-more-users').addClass('submit-new-users').removeClass('add-more-users');
    let text = $('.submit-new-users').data('text');
    $('.submit-new-users').text(text);
    $('.submit-new-users').after("<input type='number' name='additionalSeats'>");
  },
  'submit .newSeats'(event) {
    console.log('submit new users');
    event.preventDefault();
    const target = event.target;
    const additionalSeats = target.additionalSeats.value;
    console.log(additionalSeats);
    Meteor.call('addAdditionalSeats', additionalSeats, function(error, response) {
      if (error) {
        console.log(error.reason);
      } else {
        console.log(response);
      }
    });
  }
})
