Template.body.onCreated(function() {
  Tracker.autorun(function () {
    Meteor.subscribe("this.user");
  });
})
