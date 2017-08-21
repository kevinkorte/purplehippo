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
      return Viewings.find({completed: { $ne: true}, $or: [{"followers.email": email},{user: Meteor.userId()}]}, {sort: {startTime: 1}});
      // return Viewings.find({});

    }
  },
  hasViewings() {
    // let user = Meteor.users.findOne(Meteor.user());
    if (Meteor.user()) {
      let email = Meteor.user().emails[0].address;
      // return Viewings.find({$or: [{"followersEmail": email},{author: Meteor.userId()}]}, {sort: {startTime: 1}});
      if (Viewings.find({}).count() > 0) {
        return true;
      } else {
        return false;
      }

    }
  },
  expired: function(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.expired == true) {
        return 'expired-card'
      }
    }
  },
  active: function(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.active == true) {
        return 'active-card'
      }
    }
  },
  getNumOfFollowers(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.followers) {
        let num = Object.keys(viewing.followers).length;
        return num;
      } else {
        return 0;
      }
    }
  },
  getDateAsString(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.startTime) {
        return moment(viewing.startTime).format("ddd, MMM Do YYYY");
      } else {
        return;
      }
    } else {
      return;
    }
  },
  getTimeAsString(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.startTime && viewing.endTime) {
        let start = moment(viewing.startTime).format("h:mma");
        let end = moment(viewing.endTime).format("h:mma");
        return start + " - " + end;
      } else {
        return;
      }
    } else {
      return;
    }
  },
  getUserOfViewing(id) {
    let user = Meteor.users.findOne(id);
    if ( user ) {
      if (user.profile) {
        if (user.profile.name) {
          return user.profile.name;
        }
      } else {
        return user.emails[0].address;
      }
    }
  },
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
