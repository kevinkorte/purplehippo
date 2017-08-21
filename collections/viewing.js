Viewings = new Mongo.Collection("viewings");

ViewingSchema = new SimpleSchema({
  address: {
    type: String,
    label: "Address",
    optional: true
  },
  client: {
    type: String,
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
  expired: {
    type: Boolean,
    optional: true
  },
  alertsSent: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return false
      }
    }
  },
  user: {
    type: String,
    autoValue: function() {
      if (this.isInsert) {
        return this.userId
      }
    }
  },
  active: {
    type: Boolean,
    defaultValue: false
  },
  completed: {
    type: Boolean,
    optional: true
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
