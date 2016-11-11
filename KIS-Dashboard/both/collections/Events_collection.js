Tdos = new Mongo.Collection("tdos");
Events = new Mongo.Collection("events");


if(Meteor.isServer) {
   Meteor.publish('events', function() {
   	var currentUserId = this.userId;
      return Events.find({ createdBy: currentUserId });
   });

   Meteor.publish('tdos', function() {
      return Tdos.find();
   });
}

if (Meteor.isClient) {
   Meteor.subscribe('tdos');
   Meteor.subscribe('events');
};