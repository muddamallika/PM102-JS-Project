import { Session } from 'meteor/session'

if(Meteor.isClient) {

/* myArticle Template Binding functionality */  
    
Template.myArticle.helpers({
         articles: function() {
              var currentUserId = Meteor.userId();
              return Articles.find({createdBy: currentUserId}).fetch().reverse();}
 });
    
    
    
/* myarticle_group Template Binding functionality */  
    
Template.myarticle_group.helpers({
  articles: function() {
  	var selectval=Session.get("selectval");
    var currentUserId = Meteor.userId();
    var a = selectval;
    return Articles.find({Category: a, createdBy: currentUserId}).fetch().reverse();
  }
});

/* view myarticle by category functionality */ 
    
Template.myArticle.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
    $("#myarticlesel").show();
    $("#welcomeyou").hide();
  }

});

   
    /* myarticle_stickyNote Template Binding functionality */  
   Template.myarticle_stickyNote.helpers({
         articles: function() { 
            var currentUserId = Meteor.userId();
            return Articles.find({createdBy: currentUserId}).fetch().reverse();
         }
    });
    
    /* CommentsCount Template Binding functionality */  
     Template.CommentsCount.helpers({
         comments: function() {
              var currentArticleId = this._id;
             alert(currentArticleId);
              return Comments.find({currentArticleID: currentArticleID}).fetch();}
    });
    
if(Meteor.isServer) {

}
}


