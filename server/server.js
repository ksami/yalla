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
    var speak = Meteor.npmRequire('speakeasy-nlp');
    var r1 = speak.sentiment.analyze("cats are dumb");
    console.log("-- Sentiment --");
    console.log(r1);
  });

  // async callbacks to be wrapped in Meteor.bindEnvironment()
    twitter.get('search/tweets', { q: 'banana since:2011-11-11', lang: en, count: 3 }, Meteor.bindEnvironment(
      function(err, data, response) {
        console.log(data);

        for (var i = data.statuses.length - 1; i >= 0; i--) {
          var status = data.statuses[i];

          _db_tasks.insert({
            text: status.text,
            createdAt: status.created_at,
            owner: status.user.name,
            username: status.user.screen_name
          });
        };
        
      },
      function(e) {
        console.log('bind failure');
      }
    ));

}
