import 'jquery-mask-plugin';

Template.addFollower.onRendered(function() {

$('#phoneNumber').mask('(000) 000-0000', {
  placeholder: "(   )   -    "
});
$('#editPhoneNumber').mask('(000) 000-0000', {
  placeholder: "(   )   -    "
});

});

Template.addFollower.events({
  'click .editFollower'(event) {
    event.preventDefault();
    let followerId = $(event.target).data('id');
    let follower = Followers.findOne(followerId);
    if (follower) {
      Session.set('follower', follower);
      Tracker.afterFlush(() => { $('#editPhoneNumber').trigger('input') })
    }



  },
  'click .close-edit-modal'(event) {
    Session.set('follower', null);
    // $('#editPhoneNumber').unbind('trigger');
  },
  'submit .js-create-new-follower'(event) {
    event.preventDefault();
      const target = event.target;
      const phone = target.phoneNumber.value;
      const email = target.emailAddress.value;
      const name = target.name.value;
      const phoneCleaned = phone.replace(/[()-\s]/g, '');
      if(!name) {
        Session.set('nameRequired', 'Don\'t forget a name is required!');
      } else {
        Session.set('nameRequired', null);
        Meteor.call('addFollower', phoneCleaned, email, name, function(error, result) {
          if (error) {
            Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
          } else {
            Bert.alert('Cool, successfully added!', 'success', 'fixed-top', 'fa-check');
            $('.js-create-new-follower')[0].reset();
          }
        });
      }
    },
    'submit .js-update-new-follower'(event) {
      event.preventDefault();
      const target = event.target;
      const phone = target.editPhoneNumber.value;
      const email = target.emailAddress.value;
      const name = target.name.value;
      const phoneCleaned = phone.replace(/[()-\s]/g, '');
      let session = Session.get('follower');
      if(!name) {
        Session.set('nameRequired', 'Don\'t forget a name is required!');
      } else {
        Session.set('nameRequired', null);
        Meteor.call('updateFollower', session._id, phoneCleaned, email, name, function(error, result) {
          if (error) {
            Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
          } else {
            $('#editModal').modal('hide');
            Bert.alert('Cool, successfully added!', 'success', 'fixed-top', 'fa-check');
            $('.js-update-new-follower')[0].reset();
          }
        });
      }
    }
});

Template.addFollower.helpers({
  hasDanger() {
    if (Session.get('nameRequired')) {
      return 'has-danger';
    }
  },
  nameRequired() {
    if (Session.get('nameRequired')) {
      return Session.get('nameRequired');
    }
  },
  follower() {
    return Followers.find({});
  },
  editFollowerName() {
    let follower = Session.get('follower');
    if (follower) {
      return follower.name;
    }
  },
  editFollowerPhone() {
    let follower = Session.get('follower');
    if (follower) {
      return follower.phoneNumber;
    }
  },
  editFollowerEmail() {
    let follower = Session.get('follower');
    if (follower) {
      return follower.email;
    }
  },
  hasPhone(id) {
    let follower = Followers.findOne(id);
    if (follower) {
      if (follower.phoneNumber) {
        return '<i class="icon call"></i>';
      }
    }
  },
  hasEmail(id) {
    let follower = Followers.findOne(id);
    if (follower) {
      if (follower.email) {
        return '<i class="icon mail"></i>';
      }
    }
  }
});

Template.addFollower.onCreated(function() {
  let self = this;
  self.autorun(function() {
    self.subscribe('followers');
  });
});
