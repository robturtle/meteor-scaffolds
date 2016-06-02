import { Factory } from 'meteor/dburles:factory';
import { Tasks } from './tasks.js';

import '../users.factory.js';

Factory.define('task', Tasks, {
  text: 'created by factory',
  createdAt: new Date(),
  owner: Factory.get('user'),
  username: Factory.get('user').attributes.username,
});
