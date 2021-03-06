Meteor.startup(function() {
  let stripeKey = Meteor.settings.public.stripe.testPubKey;
  Stripe.setPublishableKey( stripeKey );
});

Template.signup.rendered = function() {
  $('.signup-form').validate({
    rules: {
      name: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      },
      passwordVerify: {
        minlength: 6,
        equalTo: "#password"
      }
    },
    messages: {
      name: {
        required: "Please enter your name."
      },
      email: {
        required: "Please enter your email address to sign up.",
        email: "Please enter a valid email address."
      },
      password: {
        required: "Please enter a password to sign up.",
        minlength: "Please use at least six characters."
      },
      passwordVerify: {
        minlength: "Please use at least six characters.",
        equalTo: "Your passwords do not match."
      }
    },
    submitHandler: function() {
      let customer = {
        name: $('[name="name"]').val(),
        email: $('[name="email"]').val(),
        password: $('[name="password"]').val(),
        numUsers: $('[name="numUsers"]').val()
      }
      //change submit button to loading here
      Meteor.call('createTrialCustomer', customer, function(error, response) {
        if (error) {
          alert(error.reason);
          //reset submit button
        } else {
          if (response.error) {
            alert(response.message);
            //reset submit button
          } else {
            Meteor.loginWithPassword(customer.email, customer.password, function(error) {
              if (error) {
                alert(error.reason);
                //reset submit button
              } else {
                FlowRouter.go('manageUsers');
                //Go somewhere with FlowRouter.go
                //reset submit button
              }
            });
          }
        }
      });
    }
  })
}
