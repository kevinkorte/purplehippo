import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';

Picker.middleware(bodyParser.json());

Picker.route('/stripe', (params, request, response, next) => {
  const webhook = new Promise((resolve, reject) => {
    console.log(request.body.type);
    switch (request.body.type) {
      case 'invoice.payment_succeeded':
        Meteor.call('createNewPaymentEvent', request.body, function(error, result) {
          if (error) {
            console.log (error.reason);
          } else {
            resolve('Thanks Stripe!');
          }
        })
        break;
      case 'customer.created':
        response.statusCode = 200;
        response.end();
        break;
      case 'customer.updated':
        response.statusCode = 200;
        response.end();
        break;
      case 'invoice.upcoming':
        response.statusCode = 200;
        response.end();
    }

  });

  webhook.then((result) => {
    response.statusCode = 200;
    response.end(result);
  });

})
