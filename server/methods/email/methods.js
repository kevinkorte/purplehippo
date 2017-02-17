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
            Meteor.users.update(newUser, {
              $set: {organizationId: organization._id}
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
  }
});
