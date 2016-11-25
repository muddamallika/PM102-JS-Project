Articles = new Mongo.Collection("articles");
MyArticles = new Mongo.Collection("myarticles");

if(Meteor.isServer) {
   Meteor.publish('articles', function() {
      return Articles.find();
   });
    Meteor.publish('myarticles', function() {
     var currentUserId = this.userId;
      return MyArticles.find({createdBy: currentUserId});
   });

}
if (Meteor.isClient) {
   Meteor.subscribe('articles');
   Meteor.subscribe('myarticles');
};


/*Articles.attachSchema(new SimpleSchema({
  NameOfArticle: {type: String},
  Category : {
      type: Number,
      allowedValues: [
         1,
         2,
         3,
         4,
         5,
         6,
         7,
         8,
         9,
         10,
         11,
         12
      ],
      optional: true,
      label: "Select Category",
    },

  PostArticle: {
      type: String,
      min: 20,
      max: 2000,
   }
}));
*/