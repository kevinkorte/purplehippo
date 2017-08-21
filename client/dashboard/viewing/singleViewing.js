Template.singleViewing.onRendered(function() {
  let template = this;
  template.subscribe('followers');
  template.subscribe('viewing', FlowRouter.getParam('id'), function() {
    Tracker.afterFlush(function() {
      $(".edit-followers-input").select2();

let eventId = FlowRouter.getParam('id');

if (eventId) {




  let loadTimes = (eventId) => {
    return new Promise( (resolve, reject) => {
      console.log(eventId);
      Meteor.call('getStartTime', eventId, function(error, response) {
        if (error) {
          Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
        } else if (response.startTime) {
          console.log('has date new timepicker');
          $('#start-datetime').datetimepicker({
            defaultDate: response.startTime
          });
          let startTime = response.startTime;
          Meteor.call('getEndTime', eventId, function(error, response) {
            if (error) {
              Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
              reject(error);
            } else if (response.endTime) {
              $('#end-datetime').datetimepicker({
                defaultDate: response.endTime
              });
              resolve(startTime);
            } else {
              $('#end-datetime').datetimepicker({
                useCurrent: false //Important! See issue #1075
              });
              resolve(startTime);
            }
          });
        } else {
          console.log('no date, new timepicker');
          $('#start-datetime').datetimepicker({useCurrent: false});
          Meteor.call('getEndTime', eventId, function(error, response) {
            if (error) {
              reject(error);
            } else if (response.endTime) {
              console.log('response endTime');
              $('#end-datetime').datetimepicker({
                defaultDate: response.endTime
              });
              resolve(response);
            } else {
              console.log('else');
              $('#end-datetime').datetimepicker({
                useCurrent: false //Important! See issue #1075
              });
              resolve(response);
            }
          });
        }
      });
    });
  }
  loadTimes(eventId).then((response) => {
    let thisDate = moment(response);
    console.log(thisDate);
    $('#end-datetime').data('DateTimePicker').minDate(thisDate);
    $('#start-datetime').on('dp.change', function(event) {
      $('#end-datetime').data('DateTimePicker').minDate(event.date);
      let updateStartDateTime = event.date._d;
      Meteor.call('updateStartDateTime', eventId, updateStartDateTime, function(error, response) {
        if (error) {
          Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
        } else {
          $('.js-form-group-start-datetime').addClass('has-success');
          $('#start-datetime').addClass('form-control-success');
          Meteor.setTimeout(function() {
            $('.js-form-group-start-datetime').removeClass('has-success');
            $('#start-datetime').removeClass('form-control-success');
          }, 2000);
        }
      });
    });

    $('#end-datetime').on('dp.change', function(event) {
      let updateEndDateTime = event.date._d;
      console.log('end date time');
      Meteor.call('updateEndDateTime', eventId, updateEndDateTime, function(error, response) {
        if (error) {
          Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
        } else {
          $('.js-form-group-end-datetime').addClass('has-success');
          $('#end-datetime').addClass('form-control-success');
          Meteor.setTimeout(function() {
            $('.js-form-group-end-datetime').removeClass('has-success');
            $('#end-datetime').removeClass('form-control-success');
          }, 2000);
        }
      })
    });
    //next on change
  });
}
    });
  });
  GoogleMaps.ready('viewingMap', function(map) {
    console.log(map);
    let marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      draggable: true,
    });
    marker.addListener('dragend', function(event) {
      let id = FlowRouter.getParam('id');
      let lat = event.latLng.lat();
      let lng = event.latLng.lng();
      if (lat && lng) {
        Meteor.call('updateMapMarker', id, lat, lng, function(error) {
          if (error) {
            Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
          }
        });
      } else {
        console.log('meteor call update marker');
        Meteor.call('updateMapMarker', id, 39.5, -98.35, function(error) {
          if (error) {
            Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
          }
        });
      }
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
      console.log('eventlat', eventLat);

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
    console.log('all followers', allFollowers);
    let currentViewing = Viewings.findOne(id);
    if (!currentViewing.followers) {
      return allFollowers
    } else {
      if (allFollowers && currentViewing.followers) {
        for( var i=allFollowers.length - 1; i>=0; i--) {
          for( var j=0; j<currentViewing.followers.length; j++) {
            if (allFollowers[i] && (allFollowers[i]._id === currentViewing.followers[j].id)) {
              allFollowers.splice(i, 1);
            }
          }
        }
        return allFollowers;
      }
    }
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
  'submit .update-client-form'(event) {
    event.preventDefault();
    let eventId = FlowRouter.getParam('id');
    Meteor.call('updateClient', event.target.client.value, eventId, (error, result) => {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
      } else {
        let eventId = FlowRouter.getParam('id');
        if (eventId) {
          let viewing = Viewings.findOne(eventId);
          if (viewing) {
            Session.set('clientName', viewing.client);
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
