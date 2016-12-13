Answer = new Mongo.Collection('answer');

if(Meteor.isServer) {
  Meteor.publish('answer', function() {
     return Answer.find();
  });
}

if (Meteor.isClient) {
   Meteor.subscribe('answer');
 }
