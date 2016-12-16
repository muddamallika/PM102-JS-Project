if(Meteor.isClient) {
Template.chat.events({
	'submit form':function(event){
	event.preventDefault();
	var msg = event.target.chat.value;
  var username = event.target.username.value;
	Chatting.insert({
		message:msg,
    username:username
	});
	event.target.chat.value="";
	}
});

Template.chatting_display.helpers({
  chatting: function() {
    return Chatting.find().fetch();
  }
});

}
