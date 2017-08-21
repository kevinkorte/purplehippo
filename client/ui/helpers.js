Template.registerHelper( 'getUserProfileName', () => {
  let user = Meteor.users.findOne(Meteor.userId());
  if ( user ) {
    if(user.profile) {
      return user.profile.name;
    } else {
      return user.emails[0].address;
    }
  }
});
Template.registerHelper( 'getUserEmail', () => {
  let user = Meteor.users.findOne(Meteor.userId());
  if ( user ) {
    return user.emails[0].address;
  }
});
Template.registerHelper('canVisitAdminMenu', () => {
  let me = Meteor.users.findOne(Meteor.userId());
  if ( Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
    return true;
  }
});
Template.registerHelper('isOwnerOfJob', (id) => {
  let meId = Meteor.userId();
  if (meId == id) {
    return true;
  } else {
    return false;
  }
});
