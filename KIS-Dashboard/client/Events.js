
if(Meteor.isClient) {

Template.todoList.helpers({
  tdos: function() {
    return Tdos.find();
  }
});

if(Meteor.isServer) {

}
}