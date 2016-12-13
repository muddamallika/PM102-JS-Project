//Retrieves values from the contact form and inserts them into the Contact_Details collection
if (Meteor.isClient){
  Template.Contact.events({
   'submit form': function(event){
     event.preventDefault();
     var from = event.target.email.value;
     var subj = event.target.subject.value;
     var text = event.target.message.value;
     Contact_Details.insert({
       from: from,
       subj: subj,
       text: text
     });
     event.target.email.value="";
     event.target.subject.value="";
     event.target.message.value="";
  }
});
}
