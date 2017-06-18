import twilio from 'twilio';

let accountSid = Meteor.settings.private.twilio.accountsid;
let authToken = Meteor.settings.private.twilio.authToken;
let client = new twilio(accountSid, authToken);

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
 },
 'getStartTime'(eventId) {
   console.log(eventId, 'getStartTime');
    check(eventId, String);
    return Viewings.findOne(eventId, {fields: {startTime: 1}});
  },
  getEndTime(id) {
    check(id, String);
    console.log('get end time', id);
    return Viewings.findOne(id, {fields: {endTime: 1}});
  },
  updateStartDateTime(id, dateTime) {
    check(id, String);
    check(dateTime, Date);
    console.log(dateTime);

    Viewings.update(id, {$set: {startTime: dateTime}}, function(error, response) {
      if (error) {
        return error;
      } else {
        return response;
      }
    })
  },
  updateEndDateTime(id, dateTime) {
    check(id, String);
    check(dateTime, Date);
    console.log(dateTime);
    Viewings.update(id, {$set: {endTime: dateTime}}, function(error, response) {
      if (error) {
        return error;
      } else {
        return response;
      }
    })
  },
  addEvent(lat, lng, accuracy, timestamp, eventId) {
    check(lat, Number);
    check(lng, Number);
    check(accuracy, Number);
    check(timestamp, Number);
    check(eventId, String);
    let viewing = Viewings.findOne(eventId);
    console.log(lat);
    var geo = new GeoCoder({
      // geocoderProvider: "mapquest",
      httpAdapter: "https",
      apiKey: Meteor.settings.private.mapsapi
    });
    var result = geo.reverse(lat, lng);
    // console.log(result);
    Events.insert({
      viewingId: eventId,
      lat: lat,
      lng: lng,
      accuracy: accuracy,
      timestamp: timestamp,
      eventType: 'check-in'
    }, function(error, response) {
      if (error) {
        console.log(error);
        throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
      }
      Events.update(response, {$set: {result}}, {filter: false, validate: false}, function(error,response){
        if (error) {
          throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
        } else {
          SSR.compileTemplate('checkin-text-message', Assets.getText('checkin-text.html'));
          let data = {
            userName: Meteor.users.findOne(Meteor.userId())._id,
            address: result[0].formattedAddress,
            lat: result.lat,
            lng: result.lng
          };
          console.log('data', data);
          viewing.followers.forEach(function(follower) {
            if (follower.phoneNumber) {
              client.messages.create({
                body: SSR.render('checkin-text-message', data),
                to: '+1'+follower.phoneNumber,
                from: '+19417875497'
              })
              .then((message) => console.log(message.sid));
            }
          });
        }
      });
    });
    // Events.update({result}, {filter: false, validate: false});
  },
  startViewing(lat, lng, accuracy, timestamp, eventId) {
    check(lat, Number);
    check(lng, Number);
    check(accuracy, Number);
    check(timestamp, Number);
    check(eventId, String);
    let viewing = Viewings.findOne(eventId);
    Viewings.update(eventId, {$set: {active: true, startTime: new Date()}});
    var geo = new GeoCoder({
      // geocoderProvider: "mapquest",
      httpAdapter: "https",
      apiKey: Meteor.settings.private.mapsapi
    });
    var result = geo.reverse(lat, lng);
    // console.log(result);
    Events.insert({
      viewingId: eventId,
      lat: lat,
      lng: lng,
      accuracy: accuracy,
      timestamp: timestamp,
      eventType: 'manual-start'
    }, function(error, response) {
      if (error) {
        console.log(error);
        throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
      }
      Events.update(response, {$set: {result}}, {filter: false, validate: false}, function(error,response){
        if (error) {
          throw new Meteor.Error('add-event', 'Opps, something went wrong updating your location');
        } else {
          SSR.compileTemplate('manual-start-message', Assets.getText('manual-start-text.html'));
          let data = {
            userName: Meteor.users.findOne(Meteor.userId())._id,
            address: result[0].formattedAddress,
            lat: result.lat,
            lng: result.lng
          };
          console.log('data', data);
          viewing.followers.forEach(function(follower) {
            if (follower.phoneNumber) {
              client.messages.create({
                body: SSR.render('manual-start-message', data),
                to: '+1'+follower.phoneNumber,
                from: '+19417875497'
              })
              .then((message) => console.log(message.sid));
            }
          });
        }
      });
    });
    // Events.update({result}, {filter: false, validate: false});
  }
});
