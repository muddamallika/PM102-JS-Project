//
if(Meteor.isClient){
//
Template.canceldb.helpers({
  regis_events: function() {
    return Regis_Events.find().fetch();
  }
});
//
Template.cancel_event.events({
	'submit form':function(event,error){
		event.preventDefault();
		var currentid = event.target.cancel.value;
		Regis_Events.remove({_id: currentid});   // Cancelling the registration for the Event
		  Router.go('/Events/event');
	}

});
}
