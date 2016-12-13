Register_Update = new Mongo.Collection("register_update");

if(Meteor.isServer) {
   Meteor.publish('register_update', function() {
     var curr_userid = this.userId;
      return Register_Update.find({usrid : curr_userid},{sort:{'time': -1}, limit:1});
   });
}

if(Meteor.isClient) {
	Meteor.subscribe('register_update');
}
