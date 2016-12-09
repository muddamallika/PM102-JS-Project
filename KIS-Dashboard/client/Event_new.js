if(Meteor.isClient) {
Template.event_new.events({
    'submit form': function(event){
    event.preventDefault();
    var eventName = event.target.eventName.value;   // Extracting values from front end and assigning to specific variables
    var eventDesc = event.target.eventDesc.value;
    var eventLoc = event.target.eventLoc.value;
    var eventDate = event.target.eventDate.value;
    var eventTime = event.target.eventTime.value;
    var currentUserId = Meteor.userId();
    Total_Events.insert({       // Inserting Variables in a Collection named Total_Events
        eventName:eventName,
        eventDesc:eventDesc,
        eventLoc:eventLoc,
        eventDate:eventDate,
        eventTime:eventTime        
    });
    Events.insert({           // Inserting Variables in a Collection named Events
        eventName:eventName,
        eventDesc:eventDesc,
        eventLoc:eventLoc,
        eventDate:eventDate,
        eventTime:eventTime,
        createdBy: currentUserId
    });

    event.target.eventName.value="";        // After Adding them Emptying the values.
    event.target.eventDesc.value="";
    event.target.eventLoc.value="";
    event.target.eventDate.value="";
    event.target.eventTime.value="";
}  
});

}