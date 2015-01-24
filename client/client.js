if (Meteor.isClient) {
  // // accept the subset of db
  // Meteor.subscribe("tweets");;

  // var _db_tweets = Meteor._db_tweets;;

  // // Helpers define variables/data rendered in html
  // Template.body.helpers({
  //   tweets: function () {;
  //     if (Session.get("hideCompleted")) {
  //       // If hide completed is checked, filter tweets;
  //       return _db_tweets.find({checked: {$ne: true}}, {sort: {createdAt: -1}});;
  //     } else {
  //       // Otherwise, return all of the tweets;
  //       return _db_tweets.find({}, {sort: {createdAt: -1}});;
  //     }
  //   },
  //   hideCompleted: function () {
  //     return Session.get("hideCompleted");
  //   },
  //   incompleteCount: function () {
  //     return _db_tweets.find({checked: {$ne: true}}).count();;
  //   }
  // });

  // // Events define listeners for actions
  // Template.body.events({
  //   "submit .new-task": function (event) {
  //     // This function is called when the new task form is submitted

  //     var newData = event.target.input_text.value;

  //     Meteor.call("addTask", newData);

  //     // Clear form
  //     event.target.input_text.value = "";

  //     // Prevent default form submit
  //     return false;
  //   },

  //   "change .hide-completed input": function (event) {
  //     Session.set("hideCompleted", event.target.checked);
  //   }
  // });

  // Template.task.helpers({
  //   isOwner: function () {
  //     return this.owner === Meteor.userId();
  //   }
  // });

  // Template.task.events({
  //   "click .toggle-checked": function () {
  //     // Set the checked property to the opposite of its current value
  //     Meteor.call("setChecked", this._id, ! this.checked);
  //   },
  //   "click .delete": function () {
  //     Meteor.call("deleteTask", this._id);
  //   },
  //   "click .toggle-private": function () {
  //     Meteor.call("setPrivate", this._id, ! this.private);
  //   }
  // });

  // // {{> loginButtons}} in html
  // // meteor remove insecure
  // // meteor install accounts-ui
  // // auth type: accounts-password, accounts-facebook etc
  // Accounts.ui.config({
  //   passwordSignupFields: "USERNAME_ONLY"
  // });

  var _db_tweets_1 = Meteor._db_tweets_1;
  var _db_tweets_2 = Meteor._db_tweets_2;
  Meteor.subscribe("tweets_1");
  Meteor.subscribe("tweets_2");

  Template.gameTemplate1.helpers({
    tweetCounts : function() {
      return _db_tweets_1.find().count();
    }, 
    topicName : function() {
      return Meteor.topic_1;
    }
  });

  Template.gameTemplate2.helpers({
    tweetCounts : function() {
      return _db_tweets_2.find().count();
    },

    topicName : function() {
      return Meteor.topic_2;
    }

  });
  
}