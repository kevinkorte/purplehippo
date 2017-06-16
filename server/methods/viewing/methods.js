Meteor.methods({
  'updateAddress'(address, eventId) {
    check(address, String);
    check(eventId, String);
    let viewing = Viewings.findOne(eventId);
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
   let viewing = Viewings.findOne({_id: eventId});
   if (viewing.client) {
     return viewing.client;
   }
 },
 'deleteFollowerFromViewing'(eventId, id) {
   Viewings.update({_id: eventId}, {
     $pull: {
       followers: {
         id: id
       }
     }
   });
 }
});
