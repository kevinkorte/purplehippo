const secret = Meteor.settings.private.stripe.testSecretKey;
const stripe = StripeAPI(secret);
const Future = Npm.require('fibers/future');

let future = new Future();

Meteor.methods({
  createNewPaymentEvent(request) {
    console.log(request.data.object.id);
    Payments.insert(request, {filter: false, validate: false}, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    })
  },
  addPaymentSource(request) {
    Sources.insert(request, {filter: false, validate: false}, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    });
  },
  deletePaymentSource(request) {
    console.log('delete payment source', request.data.object.id);
    let source = Sources.findOne({'data.object.id': request.data.object.id});
    console.log('source', source._id);
    Sources.remove({_id: source._id}, function(error, result) {
      if (error) {
        console.log('delete payment source error',error)
      } else {
        console.log('source removed', result);
      }
    });
  },
  customerSubscriptionUpdated(request) {
    console.log(request)
    let subId = request.data.object.id;
    console.log('subId', subId);
    let org = Organizations.findOne({'subscription.id': subId});
    Organizations.update(
      {_id: org._id},
      { $set:
        {
          'subscription.current_period_end': request.data.object.current_period_end,
          'subscription.current_period_start': request.data.object.current_period_start,
          'subscription.status': request.data.object.status
        }
      }
    )
  },
  stripeTokenHandler(token) {
    console.log(Meteor.userId());
    let user = Meteor.users.findOne(Meteor.userId());
    let org = Organizations.findOne({_id: user.organizationId});
    console.log(org.customerId);
    console.log(token);

    stripe.customers.update(org.customerId, {
      source: token.id //token.id
    }, function(err, customer) {
      if (err) {
        // throw new Meteor.Error('stripeTokenError', 'There was an error');
        console.log(err);
        future.throw(err);

      } else {
        console.log(customer);
        future.return(customer);
      }
    })
    return future.wait();
  }
});
