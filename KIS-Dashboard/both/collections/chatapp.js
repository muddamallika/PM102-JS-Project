Chatting = new Mongo.Collection('chatting');


if(Meteor.isServer) {

  Meteor.publish('chatting', function() {
     return Chatting.find();
  });
}

if (Meteor.isClient) {
   Meteor.subscribe('chatting');
 }
