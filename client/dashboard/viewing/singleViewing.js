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
  }
});

Template.singleViewing.onRendered(function() {
  GoogleMaps.ready('viewingMap', function(map) {
    let marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
      draggable: true,
    });
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