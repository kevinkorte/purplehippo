const Future = Npm.require('fibers/future');

const secret = Meteor.settings.private.stripe.testSecretKey;
const Stripe = StripeAPI(secret);

Meteor.methods({
  createTrialCustomer: function(customer) {
    check(customer, {
      name: String,
      email: String,
      password: String,
      numUsers: String
    });

    let emailRegex = new RegExp(customer.email, "i");
    console.log(emailRegex, 'emailRegex');
    let lookupCustomer = Meteor.users.findOne({"emails.address": emailRegex});
    console.log(lookupCustomer, 'lookupCustomer');
    if (!lookupCustomer) {
      let newCustomer = new Future();

      Meteor.call('stripeCreateCustomer', customer.email, customer.name, function(error, stripeCustomer){
        if (error) {
          console.log(error);
        } else {
          let customerId = stripeCustomer.id;
          let plan = 'basic_0217';

          Meteor.call('stripeCreateSubscription', customerId, plan, customer.numUsers, function(error, response) {
            if (error) {
              console.log(error);
            } else {
              //handle successful subscription here
              try {
                let user = Accounts.createUser({
                  email: customer.email,
                  password: customer.password,
                  profile: {
                    name: customer.name,
                  }
                });
                console.log('stripeCustomer', stripeCustomer);
                console.log('response', response);
                let subscription = {
                  organizationId: Random.id(),
                  customerId: stripeCustomer.id,
                  subscription: {
                    plan: {
                      id: response.plan.id,
                      name: response.plan.name,
                      used: 0,
                      amount: response.plan.amount,
                    },
                    id: response.id,
                    created: response.created,
                    current_period_end: response.current_period_end,
                    current_period_start: response.current_period_start,
                    quantity: response.quantity,
                    start: response.start,
                    status: response.status,
                    trial_end: response.trial_end,
                    trial_start: response.trial_start
                  }
                }
                Meteor.users.update(user, {
                  $set: subscription
                }, function(error, response) {
                  if (error) {
                    console.log(error);
                  } else {
                    newCustomer.return(user);
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
      throw new Meteor.Error('customer-exists', 'Sorry, that customer email already exists.');
    }
  }, //ends createTrialCustomer method
  stripeCreateCustomer: function(email, name) {
    check(email, String);
    check(name, String);
    let stripeCustomer = new Future();

    Stripe.customers.create({
      email: email,
      description: name
    }, function(error, customer) {
      if (error) {
        stripeCustomer.return(error);
      } else {
        stripeCustomer.return(customer);
      }
    });
    return stripeCustomer.wait();
  },
  stripeCreateSubscription: function(customer, plan, quantity) {
    check(customer, String);
    check(plan, String);
    check(quantity, String);
    let stripeSubscription = new Future();

    Stripe.customers.createSubscription(customer, {
      plan: plan,
      quantity: quantity
    }, function(error, subscription) {
      if (error) {
        stripeSubscription.return(error);
      } else {
        stripeSubscription.return(subscription);
      }
    });
    return stripeSubscription.wait();
  }
})
