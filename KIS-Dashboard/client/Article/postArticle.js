  if (Meteor.isClient) {
 Template.pArticle.events({
	'submit .container': function(event){
	event.preventDefault();
    var Category = event.target.Category.value;
    var Article = event.target.Article.value;
    var currentUserId = Meteor.userId();
        console.log(currentUserId);
    var createdat = new Date();
    Articles.insert({
        Category: Category,
        Article: Article        
    });
   MyArticles.insert({
        Category: Category,
        Article: Article,
    	createdBy: currentUserId,
        createdat:createdat
    });
    event.target.Category.value = "1";
    event.target.Article.value = "";
}  
});
  }