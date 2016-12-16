Articles = new Mongo.Collection("articles");
MyArticles = new Mongo.Collection("myarticles");
Comments= new Mongo.Collection("comments");
Likes= new Mongo.Collection("likes");
DisLikes= new Mongo.Collection("dislikes");
Paging=new Mongo.Collection("paging");

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
      Meteor.publish('paging', function() {
      return Paging.find();
   });  
    Meteor.publish('dislikes', function() {
      return Likes.find();
   });
}
if (Meteor.isClient) {
   Meteor.subscribe('articles');
   Meteor.subscribe('myarticles'); 
   Meteor.subscribe('comments');
   Meteor.subscribe('likes');
   Meteor.subscribe('paging');
   Meteor.subscribe('dislikes');

};


