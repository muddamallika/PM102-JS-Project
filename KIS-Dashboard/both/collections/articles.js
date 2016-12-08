Articles = new Mongo.Collection("articles");
MyArticles = new Mongo.Collection("myarticles");
Comments= new Mongo.Collection("comments");
Likes= new Mongo.Collection("likes");

if(Meteor.isServer) {
   Meteor.publish('articles', function() {
      return Articles.find();
   });
    Meteor.publish('myarticles', function() {
     var currentUserId = this.userId;
      return MyArticles.find({createdBy: currentUserId});
   });
   Meteor.publish('comments', function() {
      return Comments.find();
   });
     Meteor.publish('likes', function() {
      return Likes.find();
   });
}
if (Meteor.isClient) {
   Meteor.subscribe('articles');
   Meteor.subscribe('myarticles'); 
   Meteor.subscribe('comments');
   Meteor.subscribe('likes');
};


