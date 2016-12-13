//
if(Meteor.isClient) {
Template.event_new.events({
    'submit form': function(event){
    event.preventDefault();
    var eventName = event.target.eventName.value;   // Extracting values from front end and assigning to specific variables
    var eventDesc = event.target.eventDesc.value;
    var eventLoc = event.target.eventLoc.value;
    var eventDate = event.target.eventDate.value;
    var eventTime = event.target.eventTime.value;
    var eventPrice = event.target.eventPrice.value;
    var eventSeats = event.target.eventSeats.value;
    var currentUserId = Meteor.userId();

    Total_Events.insert({       // Inserting Variables in a Collection named Total_Events
        eventName:eventName,
        eventDesc:eventDesc,
        eventLoc:eventLoc,
        eventDate:eventDate,
        eventTime:eventTime,
        eventPrice:eventPrice,
        eventSeats:eventSeats,
        user_id: currentUserId
    });
    Events.insert({           // Inserting Variables in a Collection named Events
        eventName:eventName,
        eventDesc:eventDesc,
        eventLoc:eventLoc,
        eventDate:eventDate,
        eventTime:eventTime,
        createdBy:currentUserId,
        eventPrice:eventPrice,
        eventSeats:eventSeats
    });

    event.target.eventName.value="";        // After Adding them Emptying the values.
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
