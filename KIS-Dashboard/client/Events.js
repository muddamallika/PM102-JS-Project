
if(Meteor.isClient) {

Template.todoList.helpers({
  total_events: function() {
    return Total_Events.find();
  }
});
}
if(Meteor.isServer) {

}
