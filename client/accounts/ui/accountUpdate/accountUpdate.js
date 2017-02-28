Template.accountUpdate.helpers({
  errorReason: function() {
    return Session.get('errorReason');
  },
  email: function() {
    if (Meteor.user()) {
      return Meteor.user().emails[0].address;
    }
  }
});

Template.accountUpdate.events({
  'submit .accountUpdate'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const oldEmail = Meteor.user().emails[0].address;
    console.log(email, oldEmail);
    Meteor.call('addEmail', email, oldEmail, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        // let emailRegex = new RegExp(email, "i");
        let user = Meteor.user();
        console.log(user);
        let profileName = 'Converted Account';
        Meteor.call('stripeCreateCustomer', user.emails[0].address, profileName, function(error, stripeCustomer) {
          if (error) {
            console.log(error.reason);
          } else {
            let customerId = stripeCustomer.id;
            let plan = 'basic_0217';
            Meteor.call('stripeCreateSubscription', customerId, plan, "1", function(error, response) {
              if (error) {
                console.log(error.reason);
              } else {
                try {
                  //created new stripe customer and subscription, now need to
                  //update users account with this information
                  console.log(response);
                } catch(exception) {
                  //what to catch?
                  console.log(exception);
                }
              }
            });
          }
        });
      }
    });
  }
});
