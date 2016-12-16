//Captures the variables from the new discussion form and stores the same.
if (Meteor.isClient){
  Template.newDisc.events({
   'submit form': function(event){
     event.preventDefault();
     var dTitle = event.target.discTitle.value;
     var dContent = event.target.discContent.value;
     var dAuthor = event.target.discAuthor.value;
     var dTime = new Date().toUTCString();
     //Inserts the values discussion title and discussion content variables
     Forum.insert({
       dTitle: dTitle,
       dContent: dContent,
       dAuthor: dAuthor,
       dTime: dTime
     });
     //Sends Flash Messages
     FlashMessages.sendSuccess("Discussion posted Successfully");
     event.target.discTitle.value="";
     event.target.discContent.value="";
     //Navigates back to the forum main page after displaying the success message
     Meteor.setTimeout(function () {
         Router.go('/forumMain');
     }, 5000);
  }
});
}
