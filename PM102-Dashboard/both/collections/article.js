Article = new Meteor.Collection("Article");

if(Meteor.isClient) {
Template.article.helpers({
  'records':function(){
    return Article.find({});
  }
});

Template.article.events({
  'submit #insert-form':function(e,t){
    e.preventDefault();
    var name = t.find('#aname').value;
    var cat = t.find('#acat').value;

    Article.insert({name: aname, course: acat});
  }
});
}




if(Meteor.isServer) {

}
