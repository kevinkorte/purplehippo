const Future = Npm.require('fibers/future');

const secret = Meteor.settings.private.stripe.testSecretKey;
const Stripe = StripeAPI(secret);

Meteor.methods({
  inviteUser: function(email) {
    check(email, String);
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization.quantityUsed < organization.quantity) {
        Organizations.update(organization._id, {$inc: {quantityUsed: 1}}, function(error, result) {
          if (error) {
            console.log(error.reason);
          } else {
            let newUser = Accounts.createUser({email: email});
            Roles.addUsersToRoles(newUser, ['user'], organization._id);
            Meteor.users.update(newUser, {
              $set: {
                organizationId: organization._id,
                accountActive: true,
                loginCount: 0
              }
            }, function(error, response) {
              if (error) {
                console.log(error);
              } else {
                console.log('sending enrollment email');
                Accounts.sendEnrollmentEmail(newUser);
              }
            });
          }
        });
      }
    }
  },
  addAdditionalSeats: function(additionalSeats) {
    check(additionalSeats, String);
    let numOfNewSeats = parseInt(additionalSeats);
    let seats = new Future();
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        Stripe.customers.updateSubscription(
          organization.customerId,
          { plan: organization.subscription.plan.planid,
            quantity: organization.quantity + numOfNewSeats
          },
          Meteor.bindEnvironment(function(error, response) {
            if (error) {
              seats.return(error);
            } else {
              Organizations.update(organization._id, {$inc: {quantity: numOfNewSeats}});
              seats.return(response);
            }
          }
        ));
        return seats.wait();
      }
    }
  },
  'sendChangedPasswordEmail': function() {
    console.log('email', Meteor.user().emails[0].address);
    Email.send({
      to: "kevinkorte15@gmail.com",
      from: "NurseTAP <admin@nursetap.net>",
      subject: "Your password has been changed",
      text: "Your password on NurseTap has been changed. If you are expecting this, you can ignore this email. If you did not reset your password, get in touch with us."
    })
  },
  'sendRestPasswordEmail': function() {
    console.log(Meteor.userId());
    Accounts.sendResetPasswordEmail(Meteor.userId());
  }
});
