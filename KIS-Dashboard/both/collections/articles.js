Articles = new Mongo.Collection("articles");

Articles.attachSchema(new SimpleSchema({
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
