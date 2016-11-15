Register = new Mongo.Collection("register");
Search = new Mongo.Collection("search");

Register.attachSchema(new SimpleSchema({
  Username: {type: String, label: "Username"},
  Email : {type: String, label: "Email"},
  Password : {type: String, label:"Password"}
}));