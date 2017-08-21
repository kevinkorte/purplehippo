Template.publicSingleViewing.onCreated(function() {
  var self = this;
  self.autorun(function() {
      var id = FlowRouter.getParam('id');
      self.subscribe('events', id);
      self.subscribe('viewing', id);
  });
});

Template.publicSingleViewing.onRendered(function() {
  GoogleMaps.ready('viewingMap', function(map) {
    let id = FlowRouter.getParam('id');
    let events = Events.find({viewingId: id});
    events.forEach(function(event) {
      if (event.eventType == 'check-in') {
        let position = new google.maps.LatLng(event.lat, event.lng);
        let marker = new google.maps.Marker({
          position: position,
          map: map.instance,
          icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
      } else if (event.eventType == 'manual-start') {
        let position = new google.maps.LatLng(event.lat, event.lng);
        let marker = new google.maps.Marker({
          position: position,
          map: map.instance,
          icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        });
      }
    });
    let marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      draggable: true,
    });
    // $('#start-datetime').datetimepicker();
    marker.addListener('dragend', function(event) {
      let id = FlowRouter.getParam('id');
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      Meteor.call('updateMapMarker', id, lat, lng, function(error) {
        if (error) {
          Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
        }
      });
    });
  });
});

Template.publicSingleViewing.events({
  'click .js-check-in'(event) {
    console.log(event);
    $('.js-check-in').addClass('loading');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('addEvent', lat, lng, accuracy, timestamp, id, function(error, response) {
          if ( error && error.error === "add-event" ) {
            Bert.alert( error.reason, "warning" );
            $('.js-check-in').removeClass('loading');
          } else {
            console.log('success');
            $('.js-check-in').removeClass('loading');
          }
        });
      });
    } else {
      console.log('no geo');
    }
  },
  'click .js-start'(event) {
    console.log(event);
    $('.js-start').addClass('loading');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('startViewing', lat, lng, accuracy, timestamp, id, function(error, response) {
          if ( error && error.error === "add-event" ) {
            Bert.alert( error.reason, "warning" );
            $('.js-start').removeClass('loading');
          } else {
            console.log('success');
            $('.js-start').removeClass('loading');
          }
        });
      });
    } else {
      console.log('no geo');
    }
  },
  'click .js-stop'(event) {
    console.log(event);
    $('.js-stop').addClass('loading');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude;
        let lng = position.coords.longitude;
        let accuracy = position.coords.accuracy;
        let timestamp = position.timestamp;
        let id = FlowRouter.getParam('id');
        Meteor.call('endViewing', lat, lng, accuracy, timestamp, id, function(error, response) {
          if ( error && error.error === "end-event" ) {
            Bert.alert( error.reason, "warning" );
            $('.js-stop').removeClass('loading');
          } else {
            console.log('success');
            $('.js-stop').removeClass('loading');
          }
        });
      });
    } else {
      console.log('no geo');
    }
  }
});

Template.publicSingleViewing.helpers({
  viewing: () => {
    let id = FlowRouter.getParam('id');
    return Viewings.findOne({_id: id});
  },
  viewingUser(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      let user = Meteor.users.findOne(viewing.user);
      if (user) {
        return user.profile.name;
      }
    }
  },
  shouldShowClient(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.expired) {
        return true
      }
    }
  },
  clientName(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      return viewing.client;
    }
  },
  viewingMapOptions: function() {
    let id = FlowRouter.getParam('id');
    let viewing = Viewings.findOne({_id: id});
    if ( GoogleMaps.loaded() && viewing ) {
      let eventLat = Number(viewing.lat);
      let eventLng = Number(viewing.lng);
      if (eventLat == 39.5 && eventLng == -98.35) {
        return {
          center: new google.maps.LatLng(eventLat, eventLng),
          zoom: 5,
          gestureHandling: 'cooperative'
        }
      } else {
        return {
          center: new google.maps.LatLng(eventLat, eventLng),
          zoom: 17,
          gestureHandling: 'cooperative'
        }
      }
    }
  },
  viewingIsToday: (id) => {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      let viewingDay = moment(viewing.startTime).format('MM-DD-YYYY');
      let today = moment(new Date()).format('MM-DD-YYYY');
      if (viewingDay == today) {
        return true
      }
    }
  },
  dateOfViewing: (id) => {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      console.log(viewing);
      return moment(viewing.startTime).format('MMM DD YYYY');
    }
  },
  ifHasStartTime: (id) => {
    let viewing = Viewings.findOne(id);
    if (viewing.startTime) {
      return moment(viewing.startTime).format('h:mm A');
    }
  },
  ifHasEndTime: (id) => {
    let viewing = Viewings.findOne(id);
    if (viewing.endTime) {
      return moment(viewing.endTime).format('h:mm A');
    }
  },
  progressPercentNow: (id) => {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      let currentTime = moment(Session.get('time'));
      let startTime = moment(viewing.startTime);
      let endTime = moment(viewing.endTime);
      let viewingDiff = endTime.diff(startTime);
      let currentDiff = currentTime.diff(startTime);
      return currentDiff/viewingDiff * 100;
    }
  },
  events(id) {
    let events = Events.find({viewingId: id}, {sort: {timestamp: -1}});

    if ( events ) {
      return events;
    }
  },
  geticon(id) {
    let thisEvent = Events.findOne(id);
    if (thisEvent) {
      if (thisEvent.eventType == 'check-in') {
        return '<i class="icon circular location arrow"></i>';
      } else if (thisEvent.eventType == 'manual-start' || thisEvent.eventType == 'auto-start') {
        return '<i class="icon circular flag"></i>';
      } else if (thisEvent.eventType == 'auto-end') {
        return '<i class="icon circular warning sign"></i>'
      } else if (thisEvent.eventType == 'manual-end') {
        return '<i class="icon circular flag checkered"></i>'
      }
    }
  },
  eventTitle(id) {
    let thisEvent = Events.findOne(id);
    if (thisEvent) {
      if (thisEvent.eventType == 'check-in') {
        return "Check-In"
      } else if (thisEvent.eventType == 'manual-start') {
        return "Start"
      } else if (thisEvent.eventType == 'auto-start') {
        return "Auto Start"
      } else if (thisEvent.eventType == 'auto-end') {
        return "Time Expired"
      } else if (thisEvent.eventType == 'manual-end') {
        return "Ended"
      }
    }
  },
  eventTimestamp(id) {
    let thisEvent = Events.findOne(id);
    if (thisEvent) {
      Session.get('time');
      return moment(thisEvent.timestamp).fromNow();
    }
  },
  eventAddress(id) {
    let thisEvent = Events.findOne(id);
    if (thisEvent) {
      if (thisEvent.eventType == 'check-in') {
        return "Checked in near " + thisEvent.result[0].formattedAddress;
      } else if (thisEvent.eventType == 'manual-start') {
        return "Starting near " + thisEvent.result[0].formattedAddress;
      } else if (thisEvent.eventType == 'auto-start') {
        return "This job has been started automatically"
      } else if (thisEvent.eventType == 'auto-end') {
        return "This job has automatically expired."
      } else if (thisEvent.eventType == 'manual-end') {
        return "Ended near " + thisEvent.result[0].formattedAddress;
      }
    }
  },
  eventLatLng(id) {
    let thisEvent = Events.findOne(id);
    if (thisEvent) {
      if (thisEvent.lat && thisEvent.lng) {
        return "Lat: " + thisEvent.lat + " Lng: " + thisEvent.lng;
      }
    }
  },
  textColorClass(id) {
    let thisEvent = Events.findOne(id);
    if (thisEvent) {
      if (thisEvent.eventType == 'manual-start' || thisEvent.eventType == 'auto-start') {
        return 'text-success'
      } else if (thisEvent.eventType == 'auto-end') {
        return 'text-danger'
      }
    }
  },
  startOrStop(id) {
    let viewing = Viewings.findOne(id);
    if (viewing) {
      if (viewing.active == false) {
        return true
      }
    }
  }
});
