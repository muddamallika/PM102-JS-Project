import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.myarticle_group.helpers({
  articles: function() {
  	var selectval=Session.get("selectval");
    var currentUserId = Meteor.userId();
    var a = selectval;
    return Articles.find({Category: a, createdBy: currentUserId}).fetch().reverse();
  }
});

Template.myArticle.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
    $("#myarticlesel").show();
    $("#welcomeyou").hide();
  }

});

    Template.myArticle.helpers({
         articles: function() {
              var currentUserId = Meteor.userId();
              return Articles.find({createdBy: currentUserId}).fetch().reverse();}
    });
    
 Template.myarticle_stickyNote.helpers({
         articles: function() { 
            var currentUserId = Meteor.userId();
            return Articles.find({createdBy: currentUserId}).fetch().reverse();
         }
    });
    
     Template.CommentsCount.helpers({
         comments: function() {
              var currentArticleId = this._id;
             alert(currentArticleId);
              return Comments.find({currentArticleID: currentArticleID}).fetch();}
    });
    
if(Meteor.isServer) {

}
}


