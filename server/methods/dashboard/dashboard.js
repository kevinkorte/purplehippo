Meteor.methods({
  'addNewViewing'(address, lat, lng) {
    check(address, String);
    check(lat, String);
    check(lng, String);
    //Yes, lat and lng are strings
    let v = Viewings.insert({address: address, lat: lat, lng: lng});
    return v;
  },
  'updateMapMarker'(id, lat, lng) {
    check(id, String);
    check(lat, Number);
    check(lng, Number);
    Viewings.update(id, { $set: { lat: lat, lng: lng } } );
  }
});
