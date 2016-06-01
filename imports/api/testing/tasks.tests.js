import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from '../imports/api/tasks.js';

if (Meteor.isServer) {
  describe('Tasks', function () {
    describe('methods', function () {
      const userId = Random.id();
      let taskId;

      beforeEach(function () {
        resetDatabase();
        taskId = Tasks.insert({
          text: 'test task',
          createdAt: new Date(),
          owner: userId,
          username: 'tmeasday',
        });
        assert.equal(Tasks.find().count(), 1);
      });

      it('can delete owned task', function () {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        const invocation = { userId };
        deleteTask.apply(invocation, [taskId]);
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}
