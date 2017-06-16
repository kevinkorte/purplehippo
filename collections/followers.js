Followers = new Mongo.Collection("followers");

FollowersSchema = new SimpleSchema({
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
    optional: true
  },
  email: {
    type: String,
    optional: true
  },
  belongs_to: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return Meteor.userId();
      }
    }
  }
});

Followers.attachSchema( FollowersSchema );
