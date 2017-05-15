Meteor.methods({
  'updateAddress'(address, eventId) {
    check(address, String);
    check(eventId, String);
    let viewing = Viewings.findOne(eventId);
    if (viewing.user == Meteor.userId()) {
      Viewings.update(eventId, {$set: {address: address}});
    }
  }
});
