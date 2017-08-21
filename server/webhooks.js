import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';

Picker.middleware(bodyParser.json());

Picker.route('/stripe', (params, request, response, next) => {
  const webhook = new Promise((resolve, reject) => {
    console.log(request.body.type);
    switch (request.body.type) {
      case 'invoice.payment_succeeded':
      console.log('invoice payment');
        Meteor.call('createNewPaymentEvent', request.body, function(error, result) {
          if (error) {
            console.log (error.reason);
          } else {
            resolve('Thanks Stripe!');
          }
        })
        break;
      case 'invoice.upcoming':
        response.statusCode = 200;
        response.end();
        break;
      case 'invoice.created':
        response.statusCode = 200;
        response.end();
        break;
      case 'invoice.updated':
        response.statusCode = 200;
        response.end();
        break;
      case 'customer.source.created':
        Meteor.call('addPaymentSource', request.body, function(error, result) {
          if (error) {
            console.log(error.reason);
          } else {
            resolve('Thanks Stripe!');
          }
        });
        break;
      case 'customer.source.deleted':
        Meteor.call('deletePaymentSource', request.body, function(error, result) {
          if (error) {
            console.log(error)
          } else {
            resolve('Thanks Stripe!');
          }
        });
      break;
      case 'customer.subscription.updated':
        Meteor.call('customerSubscriptionUpdated', request.body, function(error, result) {
          if (error) {
            console.log(error)
          } else {
            resolve('Thanks Stripe!')
          }
        });
        break;
      case 'customer.subscription.deleted':
        response.statusCode = 200;
        response.end();
        break;
      case 'customer.created':
        response.statusCode = 200;
        response.end();
        break;
      case 'customer.updated':
        response.statusCode = 200;
        response.end();
        break;
      case 'customer.subscription.created':
        response.statusCode = 200;
        response.end();
        break;
      case 'customer.subscription.trial_will_end':
        response.statusCode = 200;
        response.end();
        break;
      case 'charge.succeeded':
        response.statusCode = 200;
        response.end();
        break;
      case 'balance.available':
        response.statusCode = 200;
        response.end();
        break;
      case 'plan.created':
        response.statusCode = 200;
        response.end();
        break;
    }

  });

  webhook.then((result) => {
    response.statusCode = 200;
    response.end(result);
  });

})
