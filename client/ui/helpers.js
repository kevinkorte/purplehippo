Template.registerHelper( 'getUserProfileName', () => {
  let user = Meteor.users.findOne(Meteor.userId());
  if ( user ) {
    return user.profile.name;
  }
})
