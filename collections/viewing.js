Viewings = new Mongo.Collection("viewings");

ViewingSchema = new SimpleSchema({
  address: {
    type: String,
    label: "Address",
    optional: true
  },
  lat: {
    type: String,
    optional: true
  },
  lng: {
    type: String,
    optional: true
  },
  startTime: {
    type: Date,
    optional: true
  },
  endTime: {
    type: Date,
    optional: true
  },
  user: {
    type: String,
    autoValue: function() {
      return this.userId
    }
  },
  active: {
    type: Boolean,
    defaultValue: false
  },
  activeAt: {
    type: Date,
    optional: true
  },
  // "followersEmail": {
  //   type: [String],
  //   optional: true
  // }
  followers: {
    type: Array,
    optional: true
  },
  "followers.$": {
    type: Object
  },
  "followers.$.id": {
    type: String
  },
  "followers.$.name": {
    type: String,
    optional: true
  },
  "followers.$.phoneNumber": {
    type: String,
    optional: true
  },
  "followers.$.email": {
    type: String,
    optional: true
  }
})

Viewings.attachSchema( ViewingSchema );
