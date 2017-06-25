Meteor.methods({
  createNewPaymentEvent(request) {
    console.log(request.data.object.id);
    Subscriptions.insert(request, {filter: false, validate: false}, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        console.log(result);
      }
    })
  }
});
