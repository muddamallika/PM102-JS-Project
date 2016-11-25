  if (Meteor.isClient) {
 Template.pArticle.events({
	'submit .container': function(event){
	event.preventDefault();
    var Category = event.target.Category.value;
    var Article = event.target.Article.value;
    var ArticleName = event.target.ArticleName.value;
    var currentUserId = Meteor.userId();
        
    var AuthorName="";
    if(event.target.AuthorName.value!="")
        AuthorName=event.target.AuthorName.value;
    else
            AuthorName="Annonymus";
        
    var createdat = new Date();
    Articles.insert({
        Category: Category,
        Article: Article  ,
        ArticleName: ArticleName,
    	AuthorName : AuthorName,
        createdat:createdat
        
    });
   MyArticles.insert({
        Category: Category,
        Article: Article,
        ArticleName: ArticleName,
    	createdBy: currentUserId,
        createdat:createdat
    });
    event.target.Category.value = "1";
    event.target.Article.value = "";
    event.target.ArticleName.value = "";
    event.target.AuthorName.value = "";
}  
});
  }