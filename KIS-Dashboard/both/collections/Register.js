
Register_Search = new Mongo.Collection("register_search");

if(Meteor.isServer) {
   Meteor.publish('register_search', function() {
      return Register_Search.find();
   });
}

if(Meteor.isClient) {
	Meteor.subscribe('register_search');
}
