Template.addressModal.onRendered(function() {

  $('#addressModal').on('shown.bs.modal', function (e) {
    let width = $('.js-addressModal-body').width();
    $('.pac-container.pac-logo').css('width', '498px');
  });
  this.autorun(function() {
    if ( GoogleMaps.loaded() ) {
      $('.js-geocomplete-input').geocomplete({details: "form"});
    }
  });
});

Template.addressModal.events({
  'submit .address-form'(event) {
    event.preventDefault();
    let address = event.target[0].value;
    let lat = event.target[1].value;
    let lng = event.target[2].value;
    Meteor.call('addNewViewing', address, lat, lng, function(error, response) {
      if (error) {
        Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o');
      } else if (response) {
        $('.modal-backdrop').remove();
        $('#addressModal').modal('hide');
        FlowRouter.go('/'+Meteor.userId()+'/'+response);
      }
    });
  }
});
