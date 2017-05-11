import 'bootstrap';
import 'select2';
import 'select2/dist/css/select2.css';

Meteor.startup(function() {

    // code to run on server at startup
    GoogleMaps.load({
      key: Meteor.settings.public.mapsapi,
      libraries: 'places'  // also accepts an array if you need more than one
    });
});
