Meteor.publish('this.user', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {
    organizationId: 1,
    Payment: 1
  }});
});

Meteor.publish('organizationUsers', function() {
  let user = Meteor.users.findOne(this.userId);
  if (user) {
    return Meteor.users.find({organizationId: user.organizationId});
  }
});
Meteor.publish('organization', function() {
  let user = Meteor.users.findOne(this.userId);
  if (user) {
    return Organizations.find({'_id': user.organizationId});
  }
})

Meteor.publish('myDashboard', function() {
  var user = Meteor.users.findOne(this.userId);
  console.log(user.emails[0].address);
  return Viewings.find({});
  // return Viewings.find({ endTime: { $exists: true }, $or: [{"followersEmail": user.emails[0].address},{author: this.userId}]}, {sort: {startTime: 1}});
});

Meteor.publish('viewing', function(id) {
  console.log(id, 'viewing id');
  return Viewings.find({_id: id});
});

Meteor.publish('events', function(id) {
  check(id, String);
  return Events.find({viewingId: id}, {sort: {timestamp: -1}});
});

Meteor.publish('payments', function() {
  console.log('payments');
  let user = Meteor.users.findOne(this.userId);
  // console.log(user);
  if (user) {
    let organization = Organizations.findOne(user.organizationId);
    // console.log(organization);
    if (organization) {
      console.log(Payments.find({'data.object.customer': organization.customerId}).fetch());
      return Payments.find({'data.object.customer': organization.customerId});
    }
  }
});
Meteor.publish('sources', function() {
  let user = Meteor.users.findOne(this.userId);
  if (user) {
    let organization = Organizations.findOne(user.organizationId);
    if (organization) {
      return Sources.find({'data.object.customer': organization.customerId});
    }
  }
});

Meteor.publish('followers', function() {
  let user = Meteor.users.findOne(this.userId);
  if (user) {
    return Followers.find({'belongs_to': user._id});
  }
})
