Meteor.startup(function() {

  // SyncedCron.start();

});

SyncedCron.add({
  name: 'Any jobs need auto start?',
  schedule: function(parser) {
    return parser.text('every 1 minute');
  },
  job: function() {
    let viewings = Viewings.find({active: false, startTime: {$lte: new Date()}}).fetch();
    viewings.forEach(function(viewing) {
      // Viewings.update(viewing._id, {$set: {active: true, startTime: new Date()}});
      Meteor.call('autoStartViewing', viewing._id);
      console.log('just updated one');
    })
  }
});

SyncedCron.add({
  name: 'Have any jobs expired but not closed?',
  schedule: function(parser) {
    return parser.text('every 1 minute');
  },
  job: function() {
    let viewings = Viewings.find({active: true, endTime: {$lte: new Date()}, alertsSent: false}).fetch();
    console.log('expired jobs', viewings);
    viewings.forEach(function(viewing) {
      Meteor.call('autoEndViewing', viewing._id);
    })
  }
});
