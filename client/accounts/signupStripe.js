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
      }
    },
    submitHandler: function() {
      
    }
  })
}
