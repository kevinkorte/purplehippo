Meteor.publish('this.user', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {
    organizationId: 1,
    subscription: 1
  }});
});

Meteor.publish('organizationUsers', function() {
  let user = Meteor.users.findOne(this.userId);
  return Meteor.users.find({organizationId: user.organizationId});
});
