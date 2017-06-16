Template.singleViewing.onRendered(function() {
  let template = this;
  template.subscribe('viewing', FlowRouter.getParam('id'), function() {
    Tracker.afterFlush(function() {
      $(".edit-followers-input").select2();
      $('.ui.dropdown')
  .dropdown()
;
    })
  });
  GoogleMaps.ready('viewingMap', function(map) {
    let marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      draggable: true,
    });
    $('#start-datetime').datetimepicker();
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
  let eventId = FlowRouter.getParam('id');
  if (eventId) {
    Meteor.call('setAddressSession', eventId, function(error, address) {
      if (error) {
        console.log(error.reason)
      } else {
        Session.set('address', address);
      }
    });
    Meteor.call('setClientName', eventId, function(error, clientName) {
      if (error) {
        console.log(error.reason);
      } else {
        if (clientName) {
          Session.set('clientName', clientName)
        } else {
          Session.set('clientName', '');
        }
      }
    });
  }
});


Template.singleViewing.helpers({
  viewing: () => {
    let id = FlowRouter.getParam('id');
    return Viewings.findOne({_id: id});
  },
  viewingMapOptions: function() {
    let id = FlowRouter.getParam('id');
    let event = Viewings.findOne({_id: id});
    if ( GoogleMaps.loaded() && event ) {
      let eventLat = Number(event.lat);
      let eventLng = Number(event.lng);
      return {
        center: new google.maps.LatLng(eventLat, eventLng),
        zoom: 17,
        gestureHandling: 'cooperative'
      }
    }
  },
  clientButton: function(clientName) {
    if (clientName) {
      return "Update Client"
    } else {
      return "Add Client"
    }
  },
  follower(id) {
    let allFollowers = Followers.find({}).fetch();
    let currentViewing = Viewings.findOne(id);
    for( var i=allFollowers.length - 1; i>=0; i--) {
      for( var j=0; j<currentViewing.followers.length; j++) {
        if (allFollowers[i] && (allFollowers[i]._id === currentViewing.followers[j].id)) {
          allFollowers.splice(i, 1);
        }
      }
    }
    return allFollowers;
  },
  activeFollower(id) {
    console.log(id, 'id');
  },
  hasEmail(email) {
    if (email) {
      return '<i class="icon mail"></i>';
    }
  },
  hasPhone(phone) {
    if (phone) {
      return '<i class="icon call"></i>'
    }
  }
});

Template.singleViewing.events({
  'keyup .js-address'(event) {
    let eventId = FlowRouter.getParam('id');
    Meteor.call('updateAddress', event.target.value, eventId, function(error) {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      }
    });
  },
  'keyup .edit-address-input'(event) {
    let oldAddress = Session.get('address');
    let newAddress = event.target.value;
    if (oldAddress != newAddress) {
      $('.update-address-btn').removeClass('disabled');
      $('.update-address-btn').addClass('positive');
    } else {
      $('.update-address-btn').addClass('disabled');
      $('.update-address-btn').removeClass('positive');
    }
  },
  'keyup .edit-client-input'(event) {
    let oldClient = Session.get('clientName');
    let newClient = event.target.value;
    if (oldClient != newClient) {
      $('.update-client-btn').removeClass('disabled');
      $('.update-client-btn').addClass('positive');
    } else {
      $('.update-client-btn').addClass('disabled');
      $('.update-client-btn').removeClass('positive');
    }
  },
  'submit .update-address-form'(event) {
    event.preventDefault();
    let eventId = FlowRouter.getParam('id');
    Meteor.call('updateAddress', event.target.address.value, eventId, (error, result) => {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      } else {
        let eventId = FlowRouter.getParam('id');
        if (eventId) {
          let viewing = Viewings.findOne(eventId);
          if (viewing) {
            Session.set('address', viewing.address);
            $('.update-address-btn').addClass('disabled');
            $('.update-address-btn').removeClass('positive');
          }
        }
      }
    });
  },
  'submit .add-followers'(event) {
    event.preventDefault();
    let followers = $('.edit-followers-input').val();
    // followers.forEach(function(el) {console.log(el)});
    let eventId = FlowRouter.getParam('id');
    Meteor.call('addFollowers', followers, eventId, function(error, result) {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      } else {

      }
    })
  },
  'click .js-delete-follower-from-viewing'(event) {
    let eventId = FlowRouter.getParam('id');
    Meteor.call('deleteFollowerFromViewing', eventId, this.id, function(error, result) {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      } else {
        Bert.alert( 'Follower deleted!', 'success', 'growl-top-left', 'fa-check' );
      }
    })
  }
});
