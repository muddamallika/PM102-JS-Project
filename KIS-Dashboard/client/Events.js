
if(Meteor.isClient) {   // Communicating with Client 

Template.total_events_display.helpers({
  total_events: function() {
    return Total_Events.find();
  }
});

Template.my_created_events_db.helpers({
  events: function() {
    return Events.find();
  }
});

}
if(Meteor.isServer) {

}
