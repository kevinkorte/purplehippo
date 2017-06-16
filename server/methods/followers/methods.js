Meteor.methods({
  addFollower: function(phoneNumber, email, name) {
    check(name, String);
    if(phoneNumber) {
      check(phoneNumber, String);
    }
    if(email) {
      check(email, String)
    }
    Followers.insert({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
    });

  },
  addFollowers: function(followers, eventId) {
    check(followers, [String]);
    check(eventId, String)
    followers.forEach(function(followerId) {
      let follower = Followers.findOne(followerId);
      if (follower) {
        Viewings.update(eventId, {$addToSet: {
          followers: {
            id: follower._id,
            name: follower.name,
            phoneNumber: follower.phoneNumber,
            email: follower.email
          }
        }
      }, function(error, result) {
          if (error) {
            console.log(error);
          } else {
          }
        });
      }
    });
    // Viewings.update(eventId, {$set: {followers.id: followers}})
  }
})
