Organizations = new Mongo.Collection('organizations');

let Schemas = {};

PlanSchema = new SimpleSchema({
  planid: {
    type: String
  }
  // planname: {
  //   type: String
  // },
  // planused: {
  //   type: Number
  // },
  // planamount: {
  //   type: Number
  // }
});

Schemas.Organizations = new SimpleSchema({
  owner: {
    type: String,
  },
  quantityUsed: {
    type: Number
  },
  quantity: {
    type: Number
  },
  customerId: {
    type: String
  },
  subscription: {
    type: Object
  },
  'subscription.plan': {
    type: Object
  },
  'subscription.plan.planid': {
    type: String
  },
  'subscription.plan.planname': {
    type: String
  },
  'subscription.plan.planamount': {
    type: Number
  },
  'subscription.id': {
    type: String
  },
  'subscription.created': {
    type: Number
  },
  'subscription.current_period_end': {
    type: Number
  },
  'subscription.current_period_start': {
    type: Number
  },
  'subscription.start': {
    type: Number
  },
  'subscription.status': {
    type: String
  },
  'subscription.trial_end': {
    type: Number
  },
  'subscription.trial_start': {
    type: Number
  }
});

Organizations.attachSchema(Schemas.Organizations);
