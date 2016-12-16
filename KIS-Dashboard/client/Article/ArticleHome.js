

if(Meteor.isClient) {
    
/* ArticleHome Search Article functionality*/
    
    Template.ArticleHome.events({
  "click .input-group-btn": function(event, template){
    var articleSearch = template.$("#articleSearch").val();
    Session.set("articleSearch",articleSearch);
  }
});
    
/* ArticleHome Template binding functionality */
    
    Template.ArticleHome.helpers({
        articles: function() {
            return Articles.find().fetch();
        }
    }); 
    
/* Top3Article Template binding functionality */
      Template.Top3Article.helpers({
          articles: function() {
              return Articles.find({},{limit:3}).fetch();
          }
      }); 
 
}

