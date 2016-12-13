//Captures the variables from the new discussion form and stores the same.
if (Meteor.isClient){
  Template.newDisc.events({
   'submit form': function(event){
     event.preventDefault();
     var dTitle = event.target.discTitle.value;
     var dContent = event.target.discContent.value;
     //Inserts the values discussion title and discussion content variables
     Forum.insert({
       dTitle: dTitle,
       dContent: dContent
     });
     //Sends Flash Messages
     FlashMessages.sendSuccess("Discussion posted Successfully");
     event.target.discTitle.value="";
     event.target.discContent.value="";
  }
});
}
