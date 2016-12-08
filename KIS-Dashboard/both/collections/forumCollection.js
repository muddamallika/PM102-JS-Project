Forum = new Mongo.Collection('forum');

if(Meteor.isServer) {
  Meteor.publish('forum', function() {
     return Forum.find();
  });
}

if (Meteor.isClient) {
   Meteor.subscribe('forum');
 }
