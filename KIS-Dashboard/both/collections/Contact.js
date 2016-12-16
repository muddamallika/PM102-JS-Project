Contact_Details = new Mongo.Collection('contact_details');


if(Meteor.isServer) {

  Meteor.publish('contact_details', function() {

        return Contact_Details.find();

  });
}

if (Meteor.isClient) {
   Meteor.subscribe('contact_details');
 }
