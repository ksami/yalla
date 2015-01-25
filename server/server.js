if (Meteor.isServer) {
  var _db_tweets_1 = Meteor._db_tweets_1;
  var _db_tweets_2 = Meteor._db_tweets_2;

  var topic_1 = 'mac';
  var topic_2 = 'windows';
  
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

            var sent = sentiment.comparative;
            sent = sent.toFixed(2);
            var sentiment_pos = 1;
            if(sent < 0)
              sentiment_pos = 0;

            _db_tweets_1.insert({
              id: status.id_str,
              text: status.text,
              sentiment: sent,
              sentiment_positive : sentiment_pos,
              createdAt: status.created_at,
              owner: status.user.name,
              username: status.user.screen_name
            });

          }

        }
        
      },
      function(e) {
        console.log('twitterget 1 bind failure');
      }
    ));

  },
  function(e){
    console.log('setInterval 1 bind failure');
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

              var sent = sentiment.comparative;
              sent = sent.toFixed(2);
              var sentiment_pos = 1;
              if(sent < 0)
                sentiment_pos = 0;

              _db_tweets_2.insert({
                id: status.id_str,
                text: status.text,
                sentiment: sent,
                sentiment_positive : sentiment_pos,
                createdAt: status.created_at,
                owner: status.user.name,
                username: status.user.screen_name
              });
            }

          }
          
        },
        function(e) {
          console.log('twitterget 2 bind failure');
        }
      ));
        console.log("2 called " + Date.now());
    },
    function(e){
      console.log('setInterval 2 bind failure');
    }), 5000);
  },
  function(e) {
    console.log('set timeout 2 error');
  }), 2500);

}
