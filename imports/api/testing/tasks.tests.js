import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { assert } from 'meteor/practicalmeteor:chai';

import { Tasks } from '../tasks';
import '../tasks/factory.js';

if (Meteor.isServer) {
  let task;

  describe('Tasks', function () {
    describe('methods', function () {
      beforeEach(function () {
        resetDatabase();
        task = Factory.create('task');
      });

      it('can delete owned task', function () {
        const deleteTask = Meteor.server.method_handlers['tasks.remove'];
        const invocation = { userId: task.owner };
        deleteTask.apply(invocation, [task._id]);
        assert.equal(Tasks.find().count(), 0);
      });
    });
  });
}
