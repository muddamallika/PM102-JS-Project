//Events = new Mongo.Collection('events');

Tdos = new Mongo.Collection("tdos");

Tdos.schema = new SimpleSchema({
  label: {type: String},
  });
