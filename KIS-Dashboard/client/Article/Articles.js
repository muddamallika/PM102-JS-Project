import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.article_group.helpers({
  articles: function() {
  	var selectval=Session.get("selectval");
    var a = parseInt(selectval);
    return Articles.find({choose: a}).fetch();
  }
});

Template.Articles_Sel.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
  }
});


if(Meteor.isServer) {

}
}


