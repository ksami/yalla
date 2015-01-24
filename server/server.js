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
  });
  
  setInterval(Meteor.bindEnvironment(function(){
    twitter.get('search/tweets', { q: 'snsd since:2011-11-11 lang:en', count: 20 }, Meteor.bindEnvironment(
      function(err, data, response) {
        console.log(data);

        for (var i = data.statuses.length - 1; i >= 0; i--) {
          var status = data.statuses[i];

          // check if the status already exists in the database
          var isExist = _db_tasks.findOne({
            id: status.id_str
          });

          // analyse sentiment and inset into db
          if(isExist == null){
            var sentiment = speakeasy.sentiment.analyze(status.text);
            console.log("-- Sentiment --");
            console.log(sentiment);

            _db_tasks.insert({
              id: status.id_str,
              text: status.text,
              sentiment: sentiment.score,
              createdAt: status.created_at,
              owner: status.user.name,
              username: status.user.screen_name
            });
          }

        };
        
      },
      function(e) {
        console.log('twitterget bind failure');
      }
    ));
  },
  function(e){
    console.log('setInterval bind failure');
  }), 5000);

}
