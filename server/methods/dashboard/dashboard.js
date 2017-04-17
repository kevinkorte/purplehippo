Meteor.methods({
  'addNewViewing'() {
    let v = Viewings.insert({});
    return v;
  }
});
