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
  plan: {
    type: [PlanSchema]
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
});

Organizations.attachSchema(Schemas.Organizations);
