Total_Events = new Mongo.Collection("total_events");
Events = new Mongo.Collection("events");
Regis_Events = new Mongo.Collection("regis_events");
Total_Regis_Events = new Mongo.Collection("total_regis_events");


if(Meteor.isServer) {
   Meteor.publish('events', function() {
   	var currentUserId = this.userId;
      return Events.find({ createdBy: currentUserId });
   });

   Meteor.publish('total_events', function() {
      return Total_Events.find();
   });

   Meteor.publish('regis_events', function(){
   	var currentUserId = this.userId;
   	return Regis_Events.find({RegisteredUser_id: currentUserId});
   });

   Meteor.publish('total_regis_events', function(){
   	return Total_Regis_Events.find();
   });
 }

if (Meteor.isClient) {
   Meteor.subscribe('total_events');
   Meteor.subscribe('events');
   Meteor.subscribe('regis_events');
   Meteor.subscribe('total_regis_events');
};
