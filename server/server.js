if (Meteor.isServer) {
  var _db_tweets_1 = Meteor._db_tweets_1;
  var _db_tweets_2 = Meteor._db_tweets_2;

  var topic_1 = 'banana';
  var topic_2 = 'apple';
  
  // only expose subset of db
  Meteor.publish("tweets_1", function () {
    return _db_tweets_1.find();
  });

  Meteor.publish("tweets_2", function () {
    return _db_tweets_2.find();
  });

  Meteor.startup(function () {
  });
  
  var twitter = new TwitMaker(Meteor.__keys);
  var speakeasy = Meteor.npmRequire('speakeasy-nlp');

  // access topic 1 tweets
  setInterval(Meteor.bindEnvironment(function(){
    twitter.get('search/tweets', { q: topic_1 + ' since:2011-11-11 lang:en', count: 20 }, Meteor.bindEnvironment(
      function(err, data, response) {
        console.log(data);

        for (var i = data.statuses.length - 1; i >= 0; i--) {
          var status = data.statuses[i];

          // check if the status already exists in the database
          var isExist = _db_tweets_1.findOne({
            id: status.id_str
          });

          // analyse sentiment and inset into db
          if(isExist == null){
            var sentiment = speakeasy.sentiment.analyze(status.text);
            console.log("-- Sentiment --");
            console.log(sentiment);

            _db_tweets_1.insert({
              id: status.id_str,
              text: status.text,
              sentiment: sentiment.score,
              createdAt: status.created_at,
              owner: status.user.name,
              username: status.user.screen_name
            });
          }

        }
        
      },
      function(e) {
        console.log('twitterget bind failure');
      }
    ));
  },
  function(e){
    console.log('setInterval bind failure');
  }), 5000);

  //access topic 2 tweets
  setTimeout(Meteor.bindEnvironment( function() {
      setInterval(Meteor.bindEnvironment(function(){
      twitter.get('search/tweets', { q: topic_2 + ' since:2011-11-11 lang:en', count: 20 }, Meteor.bindEnvironment(
        function(err, data, response) {
          console.log(data);

          for (var i = data.statuses.length - 1; i >= 0; i--) {
            var status = data.statuses[i];

            // check if the status already exists in the database
            var isExist = _db_tweets_2.findOne({
              id: status.id_str
            });

            // analyse sentiment and inset into db
            if(isExist == null){
              var sentiment = speakeasy.sentiment.analyze(status.text);
              console.log("-- Sentiment --");
              console.log(sentiment);

              _db_tweets_2.insert({
                id: status.id_str,
                text: status.text,
                sentiment: sentiment.score,
                createdAt: status.created_at,
                owner: status.user.name,
                username: status.user.screen_name
              });
            }

          }
          
        },
        function(e) {
          console.log('twitterget bind failure');
        }
      ));
    },
    function(e){
      console.log('setInterval bind failure');
    }), 5000);
  },
  function(e) {
    console.log('set timeout error');
  }), 2500);

}
