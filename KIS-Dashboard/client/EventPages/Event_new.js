if(Meteor.isClient) {
Template.event_new.events({
    'submit form': function(event){
    event.preventDefault();
    // Extracting values from front end and assigning to specific variables
    var eventName = event.target.eventName.value;
    var eventDesc = event.target.eventDesc.value;
    var eventLoc = event.target.eventLoc.value;
    var eventDate = event.target.eventDate.value;
    var eventTime = event.target.eventTime.value;
    var eventPrice = event.target.eventPrice.value;
    var eventSeats = event.target.eventSeats.value;
    var currentUserId = Meteor.userId();

    // Inserting Variables in a Collection named Total_Events
    Total_Events.insert({
        eventName:eventName,
        eventDesc:eventDesc,
        eventLoc:eventLoc,
        eventDate:eventDate,
        eventTime:eventTime,
        eventPrice:eventPrice,
        eventSeats:eventSeats,
        user_id: currentUserId
    });

    // Inserting Variables in a Collection named Events
    Events.insert({
        eventName:eventName,
        eventDesc:eventDesc,
        eventLoc:eventLoc,
        eventDate:eventDate,
        eventTime:eventTime,
        createdBy:currentUserId,
        eventPrice:eventPrice,
        eventSeats:eventSeats
    });

    // After Adding them Emptying the values.
    event.target.eventName.value="";
    event.target.eventDesc.value="";
    event.target.eventLoc.value="";
    event.target.eventDate.value="";
    event.target.eventTime.value="";
    event.target.eventPrice.value="";
    event.target.eventSeats.value="";
    FlashMessages.sendSuccess("Successfully Created the Event");
    Meteor.setTimeout(function () {
            Router.go('/Events/event');
        }, 8000);
}

});

}
