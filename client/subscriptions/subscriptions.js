Template.body.onCreated(function() {
  Tracker.autorun(function () {
    Meteor.subscribe("this.user");
  });
});

Template.body.onCreated(function() {
  Tracker.autorun(function(user) {
    Meteor.subscribe("organizationUsers");
  })
});
