Organizations = new Mongo.Collection('organizations');

let Schemas = {};

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
