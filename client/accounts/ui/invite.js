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
      return Meteor.users.find({organizationId: organizationId, accountActive: true});
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
  },
  isOwner(id) {
    let user = Meteor.users.findOne(id);
    console.log(user);
    if (Roles.userIsInRole(id, 'owner', user.organizationId)) {
      return Roles.userIsInRole(id, 'owner', user.organizationId);
    }
  },
  isAdmin(id) {
    let user = Meteor.users.findOne(id);
    if (Roles.userIsInRole(id, 'admin', user.organizationId)) {
      return true;
    }
  },
  canVisitAdminMenu() {
    let me = Meteor.users.findOne(Meteor.userId());
    if ( Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
      return true;
    }
  },
  getUserLabel(id) {
    let user = Meteor.users.findOne(id);
    if (Roles.userIsInRole(id, 'owner', user.organizationId)) {
      return '<div class="ui black horizontal label">Owner</div>';
    } else if (Roles.userIsInRole(id, 'admin', user.organizationId)) {
      return '<div class="ui blue horizontal label">Admin</div>';
    } else {
      return '<div class="ui horizontal label">User</div>';
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
    let userId = $(event.currentTarget).data("id");
    if (Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
      swal({
        title: "Are you sure?",
        text: "This will remove this user from your organization.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Remove User",
        closeOnConfirm: false,
        showLoaderOnConfirm: true
      }, function() {
        Meteor.call('removeAccount', userId, function(error, result) {
          if (error) {
            console.log(error.reason);
          } else {
            console.log(result);
            swal({
              title: "Success",
              timer: 2000,
              showConfirmButton: false,
              type: "success"
            });
          }
        });
      });
    }
  },
  'click .makeAdmin'(event) {
    let me = Meteor.users.findOne(Meteor.userId());
    let userId = $(event.currentTarget).data("id");
    if (Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
      Meteor.call('makeUserAdmin', userId, function(error, result) {
        if (error) {
          Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
          Bert.alert( 'User successfully added as an admin', 'success', 'growl-top-right', 'fa-check');
        }
      });
    }
  },
  'click .removeAdmin'(event) {
    let me = Meteor.users.findOne(Meteor.userId());
    let userId = $(event.currentTarget).data("id");
    if (Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
      Meteor.call('removeUserAdmin', userId, function(error, result) {
        if (error) {
          Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
        } else {
          Bert.alert( 'User successfully removed as an admin', 'success', 'growl-top-right', 'fa-check');
        }
      });
    }
  }
});
