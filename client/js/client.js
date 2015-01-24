// if (Meteor.isClient) {
//   // accept the subset of db
//   Meteor.subscribe("tasks");

//   var _db_tasks = Meteor._db_tasks;

//   // Helpers define variables/data rendered in html
//   Template.body.helpers({
//     tasks: function () {
//       if (Session.get("hideCompleted")) {
//         // If hide completed is checked, filter tasks
//         return _db_tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
//       } else {
//         // Otherwise, return all of the tasks
//         return _db_tasks.find({}, {sort: {createdAt: -1}});
//       }
//     },
//     hideCompleted: function () {
//       return Session.get("hideCompleted");
//     },
//     incompleteCount: function () {
//       return _db_tasks.find({checked: {$ne: true}}).count();
//     }
//   });

//   // Events define listeners for actions
//   Template.body.events({
//     "submit .new-task": function (event) {
//       // This function is called when the new task form is submitted

//       var newData = event.target.input_text.value;

//       Meteor.call("addTask", newData);

//       // Clear form
//       event.target.input_text.value = "";

//       // Prevent default form submit
//       return false;
//     },

//     "change .hide-completed input": function (event) {
//       Session.set("hideCompleted", event.target.checked);
//     }
//   });

//   Template.task.helpers({
//     isOwner: function () {
//       return this.owner === Meteor.userId();
//     }
//   });

//   Template.task.events({
//     "click .toggle-checked": function () {
//       // Set the checked property to the opposite of its current value
//       Meteor.call("setChecked", this._id, ! this.checked);
//     },
//     "click .delete": function () {
//       Meteor.call("deleteTask", this._id);
//     },
//     "click .toggle-private": function () {
//       Meteor.call("setPrivate", this._id, ! this.private);
//     }
//   });

//   // {{> loginButtons}} in html
//   // meteor remove insecure
//   // meteor install accounts-ui
//   // auth type: accounts-password, accounts-facebook etc
//   Accounts.ui.config({
//     passwordSignupFields: "USERNAME_ONLY"
//   });
// }
if(Meteor.isClient) {
  var _db_tweets_1 = Meteor._db_tweets_1;
  var _db_tweets_2 = Meteor._db_tweets_2;
  Meteor.subscribe("tweets_1");
  Meteor.subscribe("tweets_2");

  var topic_1 = 'mac';
  var topic_2 = 'windows';

  Template.gameTemplate.helpers({
    tweetCounts1 : function() {
      return _db_tweets_1.find().count();
    }, 
    topicName1 : function() {
      return topic_1;
    },
    tweetCounts2 : function() {
      return _db_tweets_2.find().count();
    }, 
    topicName2 : function() {
      return topic_2;
    },
    newTweets1: function(){ return Session.get('newTweets1'); },
    newTweets2: function(){ return Session.get('newTweets2'); },
    newTweets1_count: function(){ return Session.get('newTweets1_count'); },
    newTweets2_count: function(){ return Session.get('newTweets2_count'); }
  });


  // init Session.newTweets
  Session.set('newTweets1_temp', []);
  Session.set('newTweets2_temp', []);

  // accumulate newTweets and trigger event
  // Tracker.autorun(function(computation) {
  //   if(Session.get('newTweets').length > 5) {
      
  //     alert("more than 5 newTweets");
  //     console.dir(Session.get('newTweets'));

  //     Session.set('newTweets', []);
  //   }
  // });

  setInterval(Meteor.bindEnvironment(
    function(){
      
      var newTweets1 = Session.get('newTweets1_temp');
      Session.set('newTweets1_count', newTweets1.length);

      if(newTweets1.length > 0){
        Session.set('newTweets1', newTweets1[0]);
        Session.set('newTweets1_temp', []);
      }

      var newTweets2 = Session.get('newTweets2_temp');
      Session.set('newTweets2_count', newTweets2.length);

      if(newTweets2.length > 0){
        Session.set('newTweets2', newTweets2[0]);
        Session.set('newTweets2_temp', []);
      }

    },
    function(e){
      console.log("newTweets bind failure")
    }
  ),5000);

  // watch for changes to db
  Meteor.autosubscribe(function() {
    _db_tweets_1.find().observe({
      added: function(item) {
        console.log(item);
        var newTweets = Session.get('newTweets1_temp');
        newTweets.push(item);
        Session.set('newTweets1_temp', newTweets);
      }
    });
    _db_tweets_2.find().observe({
      added: function(item) {
        console.log(item);
        var newTweets = Session.get('newTweets2_temp');
        newTweets.push(item);
        Session.set('newTweets2_temp', newTweets);
      }
    });
  });

}