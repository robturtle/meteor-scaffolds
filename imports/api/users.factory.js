import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

Factory.define('user', Meteor.users, {
  username: 'Tim White',
  createAt: new Date(),
});
