if(Meteor.isClient) {
	Meteor.startup(function () {

		var $player_1 = $('#player_1');
		var $player_2 = $('#player_2');

		var $player_1_pos;
		var $player_2_pos;
		var platform_x = $('.platform').offset().left;
		
		var getPosition = setInterval( function () {

			$player_1_pos = $player_1.offset().left - platform_x;
			$player_2_pos = $player_2.offset().left - platform_x;
			//console.log('player 1: ' + $player_1_pos);
			//console.log('player 2: ' + $player_2_pos);
		
		}, 100);

		var collision = function () {
			return ( $player_1_pos + 175 >= $player_2_pos && $player_1_pos + 175 <= $player_2_pos + 175 );
		}

		setInterval( function () {
			if(collision()) {
				console.log('collides');
			}
		}, 1000);

		var kick = function (elem) {
			elem.addClass('kick');
			setTimeout( function () {
					elem.removeClass('kick');
			}, 500);
		}

		var punch = function (elem) {
			elem.addClass('punch');
			setTimeout( function () {
				elem.removeClass('punch');
			}, 500);
		}

		var hadouken = function (elem) {
			elem.addClass('hadouken');
			setTimeout( function () {
				elem.removeClass('hadouken');
			}, 500);
		}

		var reverseKick = function (elem) {
			elem.addClass('reverse-kick');
			setTimeout( function() {
				elem.removeClass('reverse-kick');
			}, 500);
		}

		var walk = function (elem) {
			elem.addClass('walk');
			setTimeout (function() {
				elem.removeClass('walk');
			}, 500);
		}

		$('button').on('click', function () {
			kick($player_1);
			// punch($player_1);
			// hadouken($player_1);
			// reverseKick($player_1);
			// walk($player_1);
		});

	});
}

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

  var topic_1 = 'Android';
  var topic_2 = 'iOS';

  Template.body.helpers({
    topicName1 : function() {
      return topic_1;
    },
    topicName2 : function() {
      return topic_2;
    },
  });

  Template.gameTemplate.helpers({
    tweetCounts1 : function() {
      return _db_tweets_1.find().count();
    }, 
    
    tweetCounts2 : function() {
      return _db_tweets_2.find().count();
    }, 

    topicName1 : function() {
      return topic_1;
    },
    topicName2 : function() {
      return topic_2;
    },
    
    newTweets1: function(){
      var tweet = Session.get('newTweets1');
      console.dir(tweet);
      return tweet;
    },
    newTweets2: function(){
      var tweet = Session.get('newTweets2');
      console.dir(tweet);
      return tweet;
    },
    newTweets1_count: function(){
      return Session.get('newTweets1_count');
    },
    newTweets2_count: function(){
      return Session.get('newTweets2_count');
    }
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

      if(newTweets1.length < 5){
        Session.set('newTweets1', newTweets1);
        Session.set('newTweets1_temp', []);
      }
      else{
        var temp = [];
        for (var i = 4; i >= 0; i--) {
          temp.push(newTweets1[i]);
        };
        Session.set('newTweets1', temp);
        Session.set('newTweets1_temp', []);
      }

      var newTweets2 = Session.get('newTweets2_temp');
      Session.set('newTweets2_count', newTweets2.length);

      if(newTweets2.length < 5){
        Session.set('newTweets2', newTweets2);
        Session.set('newTweets2_temp', []);
      }
      else{
        var temp = [];
        for (var i = 4; i >= 0; i--) {
          temp.push(newTweets2[i]);
        };
        Session.set('newTweets2', temp);
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
        //console.log(item);
        var newTweets = Session.get('newTweets1_temp');
        newTweets.push(item);
        Session.set('newTweets1_temp', newTweets);
      }
    });
    _db_tweets_2.find().observe({
      added: function(item) {
        //console.log(item);
        var newTweets = Session.get('newTweets2_temp');
        newTweets.push(item);
        Session.set('newTweets2_temp', newTweets);
      }
    });
  });

}