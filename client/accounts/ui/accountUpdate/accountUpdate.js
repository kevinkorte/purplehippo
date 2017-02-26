Template.accountUpdate.helpers({
  errorMessage: function() {
    return Session.get('errorMessage');
  }
});

Template.accountUpdate.events({
  'submit .accountUpdate'(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const oldEmail = Session.get('email');
    Meteor.call('addEmail', email, oldEmail, function(error, result) {
      if (error) {
        console.log(error.reason);
      } else {
        let user = Meteor.findUserByEmail(email);
        let profileName = user.profile.name;
        Meteor.call('stripeCreateCustomer', user.emails[0].address, profileName, function(error, stripeCustomer) {
          if (error) {
            console.log(error.reason);
          } else {
            let customerId = stripeCustomer.id;
            let plan = 'basic_0217';
            Meteor.call('stripeCreateSubscription', customerId, plan, 1, function(error, response) {
              if (error) {
                console.log(error.reason);
              } else {
                try {
                  //created new stripe customer and subscription, now need to
                  //update users account with this information
                }
              }
            })
          }
        })
      }
    });
  }
});