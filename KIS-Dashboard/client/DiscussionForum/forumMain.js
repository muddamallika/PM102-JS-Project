if (Meteor.isClient){
  Template.newDisc.events({
   'submit form': function(event){
     event.preventDefault();
     var dTitle = event.target.discTitle.value;
     var dContent = event.target.discContent.value;
     Forum.insert({
       dTitle: dTitle,
       dContent: dContent
     });
     FlashMessages.sendSuccess("Successfully posted the Discussion");
     event.target.discTitle.value="";
     event.target.discContent.value="";
  }
});
}
