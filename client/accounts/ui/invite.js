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
  },
  users: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organizationId = user.organizationId;
      return Meteor.users.find({organizationId: organizationId});
    }
  },
  accountManagementLink: function(userId) {
    let user = Meteor.users.findOne(userId);
    if (user.emails[0].verified) {
      return user.emails[0].verified;
    }
  },
  isMe: function(userId) {
    let user = Meteor.users.findOne(userId);
    if (user) {
      // if (user._id == Meteor.userId()) {
      //   return true;
      // }
      return Roles.userIsInRole(userId, 'owner', user.organizationId);
    }
  }
});

Template.invite.events({
  'submit .inviteUser'(event) {
    event.preventDefault();
    const target = event.target;
    const email = target.email.value;
    Meteor.call('inviteUser', email, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        Bert.alert('Invitation Sent Successfully', 'success', 'fixed-top', 'fa-check');
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
  },
  'click .revokeInvite'(event) {
    console.log(event);
    let id = $('.revokeInvite').data('id');
    Meteor.call('revokeInvite', id, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        Bert.alert('Invitation Successfully Revoked', 'info', 'growl-bottom-left', 'fa-remove')
      }
    });
  },
  'click .removeAccount'(event) {
    let me = Meteor.users.findOne(Meteor.userId());
    if (Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
      let id = $('.removeAccount').data('id');
      Meteor.call('removeAccount', id, function(error, result) {
        if (error) {
          console.log(error.reason);
        } else {
          Bert.alert('Account Removed Successfully', 'info', 'growl-bottom-left', 'fa-remove');
        }
      });
    }
  }
})
