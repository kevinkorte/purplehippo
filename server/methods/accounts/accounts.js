Meteor.methods({
  revokeInvite: function(id) {
    let user = Meteor.users.findOne(id);
    Meteor.users.remove({_id: id}, function (error, response) {
      if (error) {
        console.log(error.reason);
      } else {
        Organizations.update(user.organizationId, {$inc: {quantityUsed: -1}});
      }
    });
  },
  firstLogin: function() {
    Meteor.users.update(Meteor.userId(), {$inc: {loginCount: 1}, $set: {lastLogin: new Date, ip: this.connection.clientAddress}});
  },
  updateLoginInfo: function(email) {
    let user = Accounts.findUserByEmail(email);
    Meteor.users.update(user._id, {$inc: {loginCount: 1}, $set: {lastLogin: new Date, ip: this.connection.clientAddress}});
  },
  removeAccount: function(id) {
    let user = Meteor.users.findOne(id);
    Meteor.users.update(id, {$set: {accountActive: false}});
  },
  checkLoginStatus: function(email) {
    let user = Accounts.findUserByEmail(email);
    if (user) {
      if (user.accountActive) {
        return true;
      } else {
        throw new Meteor.Error("deactivated", "You'll need to update your account");
      }
    }
  },
  addEmail: function(email, oldEmail) {
    check(email, String);
    check(oldEmail, String);
    let user = Accounts.findUserByEmail(oldEmail);
    console.log(user);
    let account = Accounts.addEmail(user._id, email);
    console.log(account);
  }
})
