Template.payment.onRendered(function() {
  let template = this;

  template.subscribe('payments');
});

Template.payment.helpers({
  organization() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      return Organizations.findOne(user.organizationId);
    }
  },
  getAccountStatusLabel: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        if (organization.subscription.status == "trialing") {
          return '<div class="ui black label">Trialing</div>'
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
  },
  getPayments(customerId) {
    return Subscriptions.find({});
  },
  getPaymentDate(timestamp) {
    console.log(timestamp);
    return moment.unix(timestamp).format("MMM DD, YYYY");
  },
  getPaymentAmount(amount) {
    return '$' + amount.toString();
    console.log(Random.hexString(6));
  },
  getStartDate(date) {
    if (date) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  },
  getEndDate(date) {
    if (date) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  }
});
