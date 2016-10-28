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
      autoform: {
         options: [
            {
               label: "C1",
               value: 1
            },
            {
               label: "C2",
               value: 2
            },
            {
               label: "C3",
               value: 3
            },
            {
               label: "C4",
               value: 4
            },
            {
               label: "C5",
               value: 5
            },
            {
               label: "C6",
               value: 6
            },
            {
               label: "C7",
               value: 7
            },
            {
               label: "C8",
               value: 8
            },
            {
               label: "C9",
               value: 9
            },
            {
               label: "C10",
               value: 10
            },
            {
               label: "C11",
               value: 11
            },
            {
               label: "C12",
               value: 12
            }
         ]
      }
   },
  PostArticle: {
      type: String,
      min: 20,
      max: 2000,
      autoform: {
         rows: 5
      }
   }
}));

if(Meteor.isClient) {

Template.pArticle.helpers({
  tdos: function() {
    return Tdos.find();
  }
});

if(Meteor.isServer) {

}
}
