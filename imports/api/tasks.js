import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Tasks = new Mongo.Collection('tasks');

Tasks.attachSchema(new SimpleSchema({
  text: { type: String, min: 1 },
  createdAt: { type: Date },
  owner: { type: String },
  username: { type: String },
  checked: { type: Boolean, optional: true },
  private: { type: Boolean, optional: true },
}));

Tasks.helpers({
  isPrivate() {
    return !!this.private;
  },
  isChecked() {
    return !!this.isChecked;
  },
});

if (Meteor.isServer) {
  Meteor.publish('tasks.public', () =>
    Tasks.find({
      private: { $ne: true },
    })
  );

  Meteor.publish('tasks.owned', function ownedTasks() {
    return Tasks.find({ owner: this.userId });
  });
}

Meteor.methods({

  'tasks.insert'(text) {
    check(text, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const task = {
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    };
    Tasks.insert(task);
  },

  'tasks.remove'(taskId) {
    check(taskId, String);
    const task = Tasks.findOne(taskId);
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.remove(taskId);
  },

  'tasks.setChecked'(taskId, checked) {
    check(taskId, String);
    check(checked, Boolean);
    Tasks.update(taskId, { $set: { checked } });
  },

  'tasks.setPrivate'(taskId, isPrivate) {
    check(taskId, String);
    check(isPrivate, Boolean);
    const task = Tasks.findOne(taskId);
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Tasks.update(taskId, { $set: { private: isPrivate } });
  },

});
