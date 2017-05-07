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
Template.registerHelper('canVisitAdminMenu', () => {
  let me = Meteor.users.findOne(Meteor.userId());
  if ( Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
    return true;
  }
})
