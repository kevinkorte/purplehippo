Template.payment.helpers({
  getAccountStatusLabel: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        if (organization.subscription.status == "trialing") {
          return '<div class="ui yellow label">Trialing</div>'
        }
      }
    }
  },
  getAccountStatusDate: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        return moment.unix(organization.subscription.current_period_end).format("MMM DD, YYYY");
      }
    }
  }
});
