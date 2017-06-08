Meteor.methods({
  'updateAddress'(address, eventId) {
    console.log(address, eventId);
    check(address, String);
    check(eventId, String);
    let viewing = Viewings.findOne(eventId);
    console.log(viewing);
    if (viewing.user == Meteor.userId()) {
      Viewings.update(eventId, {$set: {address: address}});
    }
  },
  'setAddressSession'(eventId) {
   let viewing = Viewings.findOne({_id: eventId});
   if (viewing) {
     return viewing.address;
   }
 },
 'setClientName'(eventId) {
   console.log(eventId);
   let viewing = Viewings.findOne({_id: eventId});
   if (viewing.client) {
     return viewing.client;
   }
 }
});
