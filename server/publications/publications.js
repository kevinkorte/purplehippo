Meteor.publish('this.user', function() {
  return Meteor.users.find({_id: this.userId}, {fields: {
    organizationId: 1,
    subscription: 1
  }});
})
