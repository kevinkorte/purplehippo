Meteor.methods({
  'addNewViewing'(address, lat, lng) {
    check(address, String);
    check(lat, String);
    check(lng, String);
    //Yes, lat and lng are strings
    let v = Viewings.insert({address: address, lat: lat, lng: lng});
    return v;
  }
});
