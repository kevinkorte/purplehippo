const Future = Npm.require('fibers/future');

const secret = Meteor.settings.private.stripe.testSecretKey;
const Stripe = StripeAPI(secret);

Meteor.methods({
  revokeInvite: function(id) {
    let user = Meteor.users.findOne(id);
    Meteor.users.remove({_id: id}, function (error, response) {
      if (error) {
        console.log(error.reason);
      } else {
        Organizations.update(user.organizationId, {$inc: {quantityUsed: -1}});
      }
    });
  },
  firstLogin: function() {
    Meteor.users.update(Meteor.userId(), {$inc: {loginCount: 1}, $set: {lastLogin: new Date, ip: this.connection.clientAddress}});
  },
  updateLoginInfo: function(email) {
    let user = Accounts.findUserByEmail(email);
    Meteor.users.update(user._id, {$inc: {loginCount: 1}, $set: {lastLogin: new Date, ip: this.connection.clientAddress}});
  },
  removeAccount: function(id) {
    let user = Meteor.users.findOne(id);
    Meteor.users.update(id, {$set: {accountActive: false}});
    Organizations.update(user.organizationId, {$inc: {quantityUsed: -1}});
  },
  makeUserAdmin(id) {
    let user = Meteor.users.findOne(id);
    Roles.setUserRoles(id, 'admin', user.organizationId);
  },
  removeUserAdmin(id) {
    let user = Meteor.users.findOne(id);
    Roles.removeUsersFromRoles(id, 'admin', user.organizationId);
  },
  checkLoginStatus: function(email) {
    let user = Accounts.findUserByEmail(email);
    if (user) {
      if (user.accountActive) {
        return true;
      } else {
        throw new Meteor.Error("deactivated", "You'll need to update your account");
      }
    }
  },
  updateUserToOwnOrganization: function(email, oldEmail) {
    check(email, String);
    check(oldEmail, String);
    console.log(email);
    console.log(oldEmail);
    let user = Accounts.findUserByEmail(oldEmail);
      if (!Roles.userIsInRole(user._id, 'owner', user.organizationId)) {
      if (user) {
        console.log(user._id);
        Accounts.addEmail(user._id, email);
        if (oldEmail != email) {
          Accounts.removeEmail(user._id, oldEmail);
          let newCustomer = new Future();
          Meteor.call('stripeCreateCustomer', Meteor.user().emails[0].address, '', function(error, stripeCustomer){
            if (error) {
              console.log(error);
            } else {
              let customerId = stripeCustomer.id;
              let plan = 'basic_0217';

              Meteor.call('stripeCreateSubscription', customerId, plan, '1', function(error, response) {
                if (error) {
                  console.log(error);
                } else {
                  try {
                    let user = Meteor.users.findOne(Meteor.userId());
                    Meteor.call('removeUserRolesFromOrg', user._id, user.organizationId);
                    Meteor.call('createOrganization', user._id, response, stripeCustomer, function(error, result){
                      if (error) {
                        console.log(error.reason);
                      } else {
                        console.log('returned organization id', result);
                        let organization = {organizationId: result, accountActive: true};
                        Meteor.users.update(user._id, {
                          $set: organization
                        }, function(error, response) {
                          if (error) {
                            console.log(error);
                          } else {
                            newCustomer.return(user);
                          }
                        });
                      }
                    });
                  } catch(exception) {
                    newCustomer.return(exception);
                  }
                }
              });
            }
          });
          return newCustomer.wait();
        } else {
          throw new Meteor.Error('error', 'Sorry, something whent wrong');
        }
      }
    } else {
      console.log('owners can not leave organizations');
    }
  },
  removeUserRolesFromOrg: function(user, organizationId) {
      console.log('removeOrg', user, organizationId);
      Roles.removeUsersFromRoles(user, ['user', 'admin'], organizationId);

  },
  updateUsersName(name) {
    Meteor.users.update({_id: Meteor.userId()}, { $set: { profile: { name: name } } } );
  }
})
