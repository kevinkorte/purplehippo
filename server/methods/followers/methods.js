import twilio from 'twilio';

let accountSid = Meteor.settings.private.twilio.accountsid;
let authToken = Meteor.settings.private.twilio.authToken;
let client = new twilio(accountSid, authToken);

Meteor.methods({
  addFollower: function(phoneNumber, email, name) {
    check(name, String);
    if(phoneNumber) {
      check(phoneNumber, String);
    }
    if(email) {
      check(email, String)
    }
    Followers.insert({
      name: name,
      phoneNumber: phoneNumber,
      email: email,
    });

  },
  addFollowers: function(followers, eventId) {
    check(followers, [String]);
    check(eventId, String)
    followers.forEach(function(followerId) {
      let follower = Followers.findOne(followerId);
      let viewing = Viewings.findOne(eventId);
      if (follower) {
        Viewings.update(eventId, {$addToSet: {
          followers: {
            id: follower._id,
            name: follower.name,
            phoneNumber: follower.phoneNumber,
            email: follower.email
          }
        }
      }, function(error, result) {
          if (error) {
            console.log(error);
          } else {
            SSR.compileTemplate('htmlEmail', Assets.getText('add-follower-email.html'));
            SSR.compileTemplate('textMessage', Assets.getText('add-follower-text.html'));
            console.log(follower.name);
            let data = {
              name: follower.name,
              userName: Meteor.users.findOne(Meteor.userId())._id,
              address: viewing.address,
              url: 'http://localhost:3000/'+Meteor.userId()+'/'+viewing._id,
            };
            if (follower.email) {
              Email.send({
                to: follower.email,
                from: "from.address@email.com",
                subject: Meteor.users.findOne(Meteor.userId())._id+" has a new appointment",
                html: SSR.render('htmlEmail', data),
              });
            }
            if (follower.phoneNumber) {
              client.messages.create({
                  body: SSR.render('textMessage', data),
                  to: '+1'+follower.phoneNumber,  // Text this number
                  from: '+19417875497' // From a valid Twilio number
              })
              .then((message) => console.log(message.sid));
            }
          }
        });
      }
    });
    // Viewings.update(eventId, {$set: {followers.id: followers}})
  }
})
