Template.signup.onCreated(function() {
  this.numUsers = new ReactiveVar(Meteor.settings.public.defaultNumOfUsers);
});

Template.signup.helpers({
  price() {
    return Template.instance().numUsers.get() * Meteor.settings.public.pricePerUser;
  },
  numUsers() {
    return Template.instance().numUsers.get();
  }
});

Template.signup.events({
  'change #pricing': function(event, instance) {
    instance.numUsers.set(event.currentTarget.value)
  },
  'submit .signup-form': function(event) {
    event.preventDefault();
    console.log(event);
  }
});
