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

		}, 50);

		var initial_pos = 300; // 300px from left for player 1 and right for player 2

		var collision = function () {
			return ( $player_1_pos + 175 >= $player_2_pos && $player_1_pos + 175 <= $player_2_pos + 175 );
		}

		var kick = function (elem) {
			var deferred = $.Deferred();
			elem.addClass('kick');
			setTimeout( function () {
					elem.removeClass('kick');
					deferred.resolve();
			}, 500);
			return deferred.promise();
		}

		var punch = function (elem) {
			var deferred = $.Deferred();
			elem.addClass('punch');
			setTimeout( function () {
				elem.removeClass('punch');
				deferred.resolve();
			}, 10000);
			return deferred.promise();
		}

		// var hadouken = function (elem) {
		// 	var deferred = $.Deferred();
		// 	elem.addClass('hadouken');
		// 	if(collision()) {
		// 		damageOponent();
		// 	}
		// 	setTimeout( function () {
		// 		elem.removeClass('hadouken');
		// 	}, 500);
		// }

		var reverseKick = function (elem) {
			var deferred = $.Deferred();
			elem.addClass('reverse-kick');
			setTimeout( function() {
				elem.removeClass('reverse-kick');
				deferred.resolve();
			}, 500);
			return deferred.promise();
		}

		var walkOpposite = function(elem, dir){
    	var deferred = $.Deferred();
    	var moveBack = setInterval(function () {
				if(elem.offset()[dir] <= initial_pos){
					elem.removeClass('walk');
					clearInterval(moveBack);
					deferred.resolve();
				} else {
					elem.addClass('walk').css(dir, '-=20px');
					setTimeout(function () {
    				elem.removeClass('walk');
    			}, 500)
				}
			}, 100);
			return deferred.promise();
		}

		var walkAhead = function (elem, dir) {
			var deferred = $.Deferred();
			var walk = setInterval(function () {
				if(collision()){
					elem.removeClass('walk');
					clearInterval(walk);
					deferred.resolve();
				} else {
					elem.addClass('walk').css(dir, '+=20px');
					setTimeout(function () {
    				elem.removeClass('walk');
    			}, 500);
				}
			}, 100);
			return deferred.promise();
		}

		function walkAndKick (elem) {
			var dir = (elem == $player_1) ? 'left' : 'right';
			var walked = walkAhead(elem, dir);
			var kicked = walked.done(function () {
				kick(elem);
			});
			kicked.done(function () {
				walkOpposite(elem, dir);
			});
		}

		function walkAndReverseKick (elem) {
			var dir = (elem == $player_1) ? 'left' : 'right';
			var walked = walkAhead(elem, dir);
			var rKicked = walked.done(function () {
				reverseKick(elem);
			});
			rKicked.done(function () {
				walkOpposite(elem, dir);
			});
		}

		function walkAndPunch (elem) {
			var dir = (elem == $player_1) ? 'left' : 'right';
			var walked = walkAhead(elem, dir);
			var punched = walked.done(function () {
				punch(elem);
			});
			punched.done(function () {
				console.log('yah');
			});
			// var returned = punched.done(function (){
			// 	walkOpposite(elem, dir);
			// });
			// returned.done(function(){
			// 	console.log('returned');
			// });
		}



		$('button').on('click', function () {
				walkAndPunch($player_1);
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
