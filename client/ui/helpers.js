Template.registerHelper( 'getUserProfileName', () => {
  let user = Meteor.users.findOne(Meteor.userId());
  if ( user ) {
    return user.profile.name;
  }
});
Template.registerHelper('canVisitAdminMenu', () => {
  let me = Meteor.users.findOne(Meteor.userId());
  if ( Roles.userIsInRole(me._id, 'admin', me.organizationId)) {
    return true;
  }
})
