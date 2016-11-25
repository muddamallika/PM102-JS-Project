import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.myarticle_group.helpers({
  myarticles: function() {
  	var selectval=Session.get("selectval");
    var a = selectval;
      console.log(a);
    return MyArticles.find({Category: a}).fetch();
  }
});

Template.myArticle.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
  }
});


if(Meteor.isServer) {

}
}


