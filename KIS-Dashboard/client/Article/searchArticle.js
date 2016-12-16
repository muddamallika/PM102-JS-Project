
if(Meteor.isClient) {
    
    /* searchArticle Template Binding functionality*/ 
    
    Template.searchArticle.helpers({
    articles: function() {
          var articleSearch=Session.get("articleSearch");
          return Articles.find({"ArticleName":  {$regex: ".*" + articleSearch + ".*"}}).fetch();
    }
  });
}

