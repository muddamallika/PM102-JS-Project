
if(Meteor.isClient) {

    Template.ArticleHome.events({
  "click .input-group-btn": function(event, template){
    var articleSearch = template.$("#articleSearch").val();
    Session.set("articleSearch",articleSearch);
  }
});
 
}

