//if(Meteor.isClient) {
//Template.postarticle.events({
//	'submit form': function(event){
//	event.preventDefault();
//    var label = event.target.label.value;
//    var description = event.target.description.value;
//    var currentUserId = Meteor.userId();
//    var createdat = new Date();
//    Articles.insert({
//        label: label,
//        description: description        
//    });
//    Myarticle.insert({
//    	label:label,
//    	description:description,
//    	createdBy: currentUserId,
//        createdat:createdat
//    });

//    event.target.label.value = "";
//    event.target.description.value = "";
//}  
//});

//}