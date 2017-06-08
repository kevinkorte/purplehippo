Meteor.setInterval(function() {
    Session.set("time", new Date().getTime());
}, 60000);

Template.dashboard.events({
  // 'click .js-create-new-event'() {
  //   Meteor.call('addNewViewing', function(error, id) {
  //     if (error) {
  //       Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
  //     } else if (id) {
  //       console.log('id', id);
  //       FlowRouter.go('/'+Meteor.userId()+'/'+id)
  //     }
  //   });
  // }
});

Template.dashboard.helpers({
  viewings: function() {
    // let user = Meteor.users.findOne(Meteor.user());
    if (Meteor.user()) {
      let email = Meteor.user().emails[0].address;
      // return Viewings.find({$or: [{"followersEmail": email},{author: Meteor.userId()}]}, {sort: {startTime: 1}});
      return Viewings.find({});

    }
  }
});
Template.dashboard.onRendered(function() {
  $('#unique-id').progress('increment');
})

Template.dashboard.onCreated(function() {
  let self = this;
  self.autorun(function() {
    console.log('dashboard subscribe');
    self.subscribe('myDashboard');
    console.log(self.subscribe('myDashboard'));
  });
});
