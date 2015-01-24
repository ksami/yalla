_db_tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // accept the subset of db
  Meteor.subscribe("tasks");

  // Helpers define variables/data rendered in html
  Template.body.helpers({
    tasks: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return _db_tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        // Otherwise, return all of the tasks
        return _db_tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return _db_tasks.find({checked: {$ne: true}}).count();
    }
  });

  // Events define listeners for actions
  Template.body.events({
    "submit .new-task": function (event) {
      // This function is called when the new task form is submitted

      var newData = event.target.input_text.value;

      Meteor.call("addTask", newData);

      // Clear form
      event.target.input_text.value = "";

      // Prevent default form submit
      return false;
    },

    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.task.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, ! this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteTask", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, ! this.private);
    }
  });

  // {{> loginButtons}} in html
  // meteor remove insecure
  // meteor install accounts-ui
  // auth type: accounts-password, accounts-facebook etc
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

// Meteor.call(method) on client, runs on client and server
// method runs on client first, server sends real result back, client updates
Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    _db_tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function (taskId) {
    // Make sure the user is logged in before inserting a task
    var task = _db_tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    } else {
      _db_tasks.remove(taskId);
    }
  },
  setChecked: function (taskId, setChecked) {
    var task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    } else {
      _db_tasks.update(taskId, { $set: { checked: setChecked} });
    }
  },
  setPrivate: function (taskId, setToPrivate) {
    var task = _db_tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    _db_tasks.update(taskId, { $set: { private: setToPrivate } });
  }
});


if (Meteor.isServer) {
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
}
