if(Meteor.isClient) {
Template.event_new.events({
	'submit form': function(event){
	event.preventDefault();
    var label = event.target.label.value;
    var location = event.target.location.value;
    var currentUserId = Meteor.userId();
    var createdat = new Date();
    Total_Events.insert({
        label: label,
        location: location        
    });
    Events.insert({
    	label:label,
    	location:location,
    	createdBy: currentUserId,
        createdat:createdat
    });

    event.target.label.value = "";
    event.target.location.value = "";
}  
});

}