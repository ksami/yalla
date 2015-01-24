if (Meteor.isClient) {
  // accept the subset of db
  Meteor.subscribe("tasks");

  var _db_tasks = Meteor._db_tasks;

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