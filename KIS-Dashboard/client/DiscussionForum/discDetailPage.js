if(Meteor.isClient){
  Template.discDetailPage.events({
      'submit form': function(event){
      event.preventDefault();

      // Extracting values from front end and assigning to specific variables
      var answerQuery = event.target.answerQuery.value;
      var discId = event.target.discId.value;
      var currentUserId = Meteor.userId();

      // Inserting Variables in a Collection named Total_Events
      Answer.insert({
          answerQuery:answerQuery,
          discId:discId,
          currentUserId: currentUserId
      });

      // After Adding them Emptying the values.
      event.target.answerQuery.value="";
      FlashMessages.sendSuccess("Successfully posted your answer for the Query");
  }
});

}
