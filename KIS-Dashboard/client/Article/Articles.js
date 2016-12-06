import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.article_group.helpers({
  articles: function() {
  	var selectval=Session.get("selectval");
    var a = selectval;
    return Articles.find({Category: a}).fetch();
  }
});

Template.Articles_Sel.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
  }
});

    Template.Allarticle.helpers({
  articles: function() {
    return Articles.find().fetch().reverse();
  }
});
      Template.Article1.helpers({
  articles: function() {
    return Articles.find().fetch().reverse() ;
  }
});
    Template.readArticle.helpers({
  articles: function() {
    return Articles.find().fetch();
  }
});
      Template.readArticle.helpers({
  myarticles: function() {
    return myArticles.find().fetch();
  }
});    
    
    Template.ArticleHome.helpers({
  articles: function() {
    return Articles.find().fetch();
  }
}); 
    
  
    
if(Meteor.isServer) {

}
}


