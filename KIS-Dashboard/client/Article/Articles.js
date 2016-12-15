import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.article_group.helpers({
  articles: function() {
  	var selectval=Session.get("selectval");
    var a = selectval;
    return Articles.find({Category: a}).fetch().reverse();
  }
});

Template.Articles_Sel.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
    switch(selectValue){
        case "Fashion":
            $("#imgF").show();
            $("#imgT").hide();
            $("#imgL").hide();
            break;
        case "Technology":
            $("#imgT").show();
            $("#imgF").hide();
            $("#imgL").hide();
            break;
        case "Lifestyle":
            $("#imgL").show();
            $("#imgF").hide();
            $("#imgT").hide();
            break;
        default:
            $("#imgF").hide();
            $("#imgT").hide();
            $("#imgL").hide();
  }
  }
   
});

    Template.Allarticle.helpers({
  articles: function() {
    return Articles.find().fetch().reverse();
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
    
      Template.Top3Article.helpers({
  articles: function() {
    return Articles.find({},{limit:3}).fetch();
  }
}); 
    
if(Meteor.isServer) {

}
}


