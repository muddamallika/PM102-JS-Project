  if (Meteor.isClient) {
 Template.pArticle.events({
     
	'submit .container': function(event){
	event.preventDefault();
    var Category = event.target.Category.value;
    var Article = event.target.Article.value;
    var ArticleName = event.target.ArticleName.value;
    var currentUserId = Meteor.userId();
        
    var ArticleInitial= "",MyArticleInitial = "";
    var spliter= Article.split(" ");
    //var len = (spliter.length > 5)? 5 :spliter.length;
    var mylen = (spliter.length > 25)? 25 :spliter.length;

      /*  for(var i=0;i < len; i++)
        {
            ArticleInitial=ArticleInitial+" "+spliter[i];
        }*/
         for(var i=0;i < mylen; i++)
        {
            MyArticleInitial=MyArticleInitial+" "+spliter[i];
        }
        
    var AuthorName="";
    if(event.target.AuthorName.value!="")
        AuthorName=event.target.AuthorName.value;
    else
        AuthorName="Anonymous";
        
    var createdat = new Date();
        
    Articles.insert({
        Category: Category,
        Article: Article  ,
        ArticleName: ArticleName,
        AuthorName : AuthorName,
        ArticleInitial: MyArticleInitial,
        MyArticleInitial: MyArticleInitial,
        createdBy: currentUserId,
        createdat:createdat

    });
        
   MyArticles.insert({
        Category: Category,
        Article: Article,
        ArticleName: ArticleName,
        ArticleInitial: ArticleInitial,
        createdBy: currentUserId,
        createdat:createdat
    });
    event.target.Category.value = "Technology";
    event.target.Article.value = "";
    event.target.ArticleName.value = "";
    event.target.AuthorName.value = "";
    
      
    $(".alert").show() ;       
    $(":submit").attr("disabled", true);  
        
    Meteor.setTimeout(function () {
            Router.go('/ArticleHome/ArticleHome');
    }, 3000);
        
  },
     'reset .container': function(event){ 
         $(":submit").removeAttr("disabled");  
          $(".alert").hide() ;
     }
  });
}
