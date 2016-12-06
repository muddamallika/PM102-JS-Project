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
}
});

Template.comments.helpers({
  comments: function() {
    var currentArticleID= this._id;
    return Comments.find({ currentArticleID: currentArticleID }).fetch().reverse();
  }
});
  }
