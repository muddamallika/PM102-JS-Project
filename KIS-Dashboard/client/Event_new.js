if(Meteor.isClient) {
Template.event_new.events({
	'submit form': function(event){
	event.preventDefault();
    var label = event.target.label.value;
    var location = event.target.location.value;
    var description = event.target.description.value;
    var currentUserId = Meteor.userId();
    var createdat = new Date();
    Tdos.insert({
        label: label,
        location: location,
        description: description
    });
    Events.insert({
    	label:label,
    	location:location,
        description: description,
    	createdBy: currentUserId,
        createdat:createdat
    });

    event.target.label.value = "";
    event.target.location.value = "";
    event.target.description.value = "";
}  
});

}