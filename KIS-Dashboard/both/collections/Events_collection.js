Tdos = new Mongo.Collection("tdos");

Tdos.attachSchema(new SimpleSchema({
  label: {type: String},
  location : {type: String}
}));
