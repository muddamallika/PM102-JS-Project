Meteor.publish('article', function(){
  return Article.find({});
});
