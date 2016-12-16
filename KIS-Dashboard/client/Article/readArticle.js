import { Meteor } from 'meteor/meteor'

if (Meteor.isClient) {
 Template.readArticle.events({
     
     /* Post a comment functionality*/
     
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
     /*Like an Article functionality*/
     
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
     
      /*UnLike an Article functionality*/
     
     'click #btnunlike': function(event){
	event.preventDefault();
    var currentid = document.getElementById("LikeID").value;
     Likes.remove({_id: currentid});
        $("#divUnlike").hide(); 
         $("#divlike").show();
     }

});
  
/* readArticle Template Binding functionality*/
  Template.readArticle.helpers({
     articles: function() {
     return Articles.find().fetch();
     }
    });
    
/* comments Template Binding functionality*/
Template.comments.helpers({
  comments: function() {
    var currentArticleID= this._id;
    return Comments.find({ currentArticleID: currentArticleID }).fetch().reverse();
  }
});

/* CommentsCount Template Binding functionality*/
Template.CommentsCount.helpers({
  comments: function() {
    var currentArticleID= this._id;
    return Comments.find({ currentArticleID: currentArticleID }).count();
  }
});

/* LikesCount Template Binding functionality*/
Template.LikesCount.helpers({
  likes: function() {
    var currentArticleID= this._id;
    return Likes.find({ currentArticleID: currentArticleID }).count();
  }
});
   
/* Commentby Template Binding functionality*/  
Template.Commentby.helpers({
          commentby: function() {
    var currentUserId= document.getElementById("currentCommenterID").value;
    return Register_Search.find({ usrId: currentUserId }).fetch();
  }
      });

/* Liked Template Binding functionality*/     
Template.Liked.helpers({
          liked: function() {
            var currentArticleID=document.getElementById("currentArticle").value; 
            var currentUserId = Meteor.userId();
              
              /*Like and Unlike button functionality */
              
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
