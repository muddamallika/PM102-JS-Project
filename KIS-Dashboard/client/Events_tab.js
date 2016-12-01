import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.eventuser.helpers({
  total_events: function() {
  	var currentList = this._id;
  	Session.set("currentList", currentList);
    return Total_Events.find({ _id: currentList });
  }
});

Template.event_tab.events({
	"submit form": function(event){
	 event.preventDefault();
	 var Eventcreated_id = Session.get("currentList");
	 var RegisteredUser_id = event.target.userid.value;
	 var RegisteredUser_name = event.target.username.value;
	 var Label = event.target.label.value;
	 var Location = event.target.location.value;
	 console.log(Location);
	 Regis_Events.insert({
	 	Eventcreated_id: Eventcreated_id,
	 	RegisteredUser_id: RegisteredUser_id,
	 	RegisteredUser_name: RegisteredUser_name,
	 	Location: Location,
	 	Label: Label
	 });
	 Total_Regis_Events.insert({
	 	Eventcreated_id: Eventcreated_id,
	 	RegisteredUser_id: RegisteredUser_id,
	 	RegisteredUser_name: RegisteredUser_name,
	 	Location: Location,
	 	Label: Label
	 });
	}
});


Template.mytemplate.helpers({
	productcount: function(x){
		var x=0;
		var Event_id = Session.get("currentList");
		return x === Regis_Events.find({ Eventcreated_id:Event_id }).count();	
	}
});


Template.totalregistrations.helpers({
	totalnum: function(){
		var Event_id = Session.get("currentList");
		return Total_Regis_Events.find({ Eventcreated_id:Event_id }).count();
	}
});

}