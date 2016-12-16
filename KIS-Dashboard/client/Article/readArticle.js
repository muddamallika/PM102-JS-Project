import { Meteor } from 'meteor/meteor'

if (Meteor.isClient) {
 Template.readArticle.events({
	'submit .container': function(event){
	event.preventDefault();
    var comment = event.target.comment.value;
    var currentArticleID=event.target.currentArticleID.value;
    var currentUserId = Meteor.userId();
    var createdate = new Date();
    var createdat=  createdate.toUTCString();
    var currentUsername = (Meteor.user()!=null)? Meteor.user().profile.name : "Anonymous";
    Comments.insert({
        Comment:   comment,
        currentArticleID:currentArticleID,
        commenterUserID: currentUserId,
        createdat: createdat,
        createdby:currentUsername
    });
        
    event.target.comment.value = "";
},
     'click #btnlike': function(event){
	event.preventDefault();
    var like = "Liked";
    var currentArticleID=document.getElementById("currentArticleID").value;
    var currentUserId = Meteor.userId();
    var createdate = new Date();
    var createdat=  createdate.toUTCString();
    Likes.insert({
        Like:   like,
        currentArticleID:currentArticleID,
        currentUserId: currentUserId,
        createdat: createdat

    });
         $("#divlike").hide(); 
         $("#divUnlike").show();
     },
     'click #btnunlike': function(event){
	event.preventDefault();
    var currentid = document.getElementById("LikeID").value;
     Likes.remove({_id: currentid});
        $("#divUnlike").hide(); 
         $("#divlike").show();
     }

});

Template.comments.helpers({
  comments: function() {
    var currentArticleID= this._id;
    return Comments.find({ currentArticleID: currentArticleID }).fetch().reverse();
  }
});
      
Template.CommentsCount.helpers({
  comments: function() {
    var currentArticleID= this._id;
    return Comments.find({ currentArticleID: currentArticleID }).count();
  }
});
      Template.LikesCount.helpers({
  likes: function() {
    var currentArticleID= this._id;
    return Likes.find({ currentArticleID: currentArticleID }).count();
  }
});
    Template.Commentby.helpers({
          commentby: function() {
    var currentUserId= document.getElementById("currentCommenterID").value;
    return Register_Search.find({ usrId: currentUserId }).fetch();
  }
      });
        Template.Liked.helpers({
          liked: function() {
            var currentArticleID=document.getElementById("currentArticle").value; 
            var currentUserId = Meteor.userId();
              if(Likes.find({ currentArticleID: currentArticleID, currentUserId: currentUserId}).count())
                  {
                      $('#liked').attr("value","yes");
                     $("#divlike").hide();
                     $("#divUnlike").show();
                  }
              else{
                    $('#liked').attr("value","no");
                    $("#divlike").show();
                    $("#divUnlike").hide();
              }
            return Likes.find({ currentArticleID: currentArticleID, currentUserId: currentUserId}).fetch();
  }
      });

}
