  if (Meteor.isClient) {
 Template.readArticle.events({
	'submit .container': function(event){
	event.preventDefault();
    var comment = event.target.comment.value;
    var currentArticleID=event.target.currentArticleID.value;
    var currentUserId = Meteor.userId();
    var createdate = new Date();
    var createdat=  createdate.toUTCString();
        
    Comments.insert({
        Comment:   comment,
        currentArticleID:currentArticleID,
        currentUserId: currentUserId,
        createdat: createdat

    });
        
    event.target.comment.value = "";
},
     'click .btnlike': function(event){
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
         $("#btnlike").attr("value", "Liked"); 
         $("#btnlike").attr("disabled", true); 
          
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


}
