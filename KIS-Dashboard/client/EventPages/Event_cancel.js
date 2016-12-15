if(Meteor.isClient){
//fetches the details of all the events that user have registered for
Template.canceldb.helpers({
  regis_events: function() {
    return Regis_Events.find().fetch();
  }
});
//Cancels the event registration
Template.cancel_event.events({
	'submit form':function(event,error){
		event.preventDefault();
		var currentid = event.target.cancel.value;
    // Cancelling the registration for the Event
		Regis_Events.remove({_id: currentid});
		  Router.go('/Events/event');
	}
});

}
