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
    // Meteor.call('addEmail', email, oldEmail, function(error, result) {
    //   if (error) {
    //     console.log(error.reason);
    //   } else {
    //     let user = Meteor.findUserByEmail(email);
    //     let profileName = user.profile.name;
    //     Meteor.call('stripeCreateCustomer', user.emails[0].address, profileName, function(error, stripeCustomer) {
    //       if (error) {
    //         console.log(error.reason);
    //       } else {
    //         let customerId = stripeCustomer.id;
    //         let plan = 'basic_0217';
    //         Meteor.call('stripeCreateSubscription', customerId, plan, 1, function(error, response) {
    //           if (error) {
    //             console.log(error.reason);
    //           } else {
    //             try {
    //               //created new stripe customer and subscription, now need to
    //               //update users account with this information
    //               console.log(response);
    //             } catch(exception) {
    //               //what to catch?
    //               console.log(exception);
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // });
  }
});
