Register = new Mongo.Collection("register");
Register.attachSchema(new SimpleSchema({
  Username: {type: String, label: "Username"},
  Email : {type: String, label: "Email"},
  Password : {type: String, label:"Password"}
}));
