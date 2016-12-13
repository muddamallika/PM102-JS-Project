
if(Meteor.isClient) {
    
    Template.searchArticle.helpers({
    articles: function() {
          var articleSearch=Session.get("articleSearch");
          return Articles.find({"ArticleName":  {$regex: ".*" + articleSearch + ".*"}}).fetch();
    }
  });
}

