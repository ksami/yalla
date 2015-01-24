if (Meteor.isServer) {
  var _db_tasks = Meteor._db_tasks;
  
  // only expose subset of db
  Meteor.publish("tasks", function () {
    return _db_tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
  Meteor.startup(function () {
    // code to run on server at startup
  });

  var twitter = new TwitMaker(Meteor.__keys);

  twitter.get('search/tweets', { q: 'banana since:2011-11-11', count: 3 }, Meteor.bindEnvironment(
    function(err, data, response) {
      console.log(data);
      _db_tasks.insert({
        text: data.statuses[0].text,
        createdAt: data.statuses[0].created_at,
        owner: data.statuses[0].user.name,
        username: data.statuses[0].user.screen_name
      });
    },
    function(e) {
      console.log('bind failure');
    }
  ));

}
