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
    return Articles.find().fetch();
  }
});
    
    Template.readArticle.helpers({
  articles: function() {
    return Articles.find().fetch();
  }
});
     
if(Meteor.isServer) {

}
}


