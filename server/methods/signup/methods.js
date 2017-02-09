const Future = Npm.require('fibers/future');

const secret = Meteor.settings.private.stripe.testSecretKey;
const Stripe = StripeAPI(secret);

Meteor.methods({
  createTrialCustomer: function(customer) {
    check(customer, {
      name: String,
      email: String,
      password: String,
      numUsers: Number
    });

    let emailRegex = new RegExp(customer.email, "i");
    let lookupCustomer = Meteor.users.findOne({"emails.address": emailRegex});

    if (!lookupCustomer) {
      let newCustomer = new Future();

      Meteor.call('stripeCreateCustomer', customer.email, function(error, stripeCustomer){
        if (error) {
          console.log(error);
        } else {
          let customerId = stripeCustomer.id

          Meteor.call('stripeCreateSubscription', customerId, function(error, response) {
            if (error) {
              console.log(error);
            } else {
              //handle successful subscription here
            }
          });
        }
      });
      return newCustomer.wait();
    } else {
      throw new Meteor.Error('customer-exists', 'Sorry, that customer email already exists.');
    }
  }, //ends createTrialCustomer method
  stripeCreateCustomer: function(email) {

  },
  stripeCreateSubscription: function() {
    
  }
})
