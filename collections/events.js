Events = new Mongo.Collection("events");

EventsSchema = new SimpleSchema({
  viewingId: {
    type: String,
  },
  lat: {
    type: String,
  },
  lng: {
    type: String,
  },
  accuracy: {
    type: Number,
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
