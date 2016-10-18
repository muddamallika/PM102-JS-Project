import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

if (Meteor.isClient) {
    Session.setDefault('counter', 0);

Template.hello.helpers({
  counter: function () {
    return Session.get('counter');
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    Session.set('counter', Session.get('counter') + 1);
  }
});
}
