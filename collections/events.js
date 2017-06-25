Events = new Mongo.Collection("events");

EventsSchema = new SimpleSchema({
  viewingId: {
    type: String,
  },
  lat: {
    type: String,
    optional: true
  },
  lng: {
    type: String,
    optional: true
  },
  accuracy: {
    type: Number,
    optional: true
  },
  timestamp: {
    type: Number,
  },
  // statement: {
  //   type: String,
  // },
  eventType: {
    type: String
  }
});

Events.attachSchema( EventsSchema );
