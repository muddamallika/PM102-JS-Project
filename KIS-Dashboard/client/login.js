import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.login_info.helpers({
  register: function() {
    return Register.find();
  }
});

Template.user_login.events({
  "change #usr": function(event, template){
    var UsrValue = template.$("#usr").val();
    console.log(UsrValue);
    Session.set("selectval",UsrValue);   
  }  
});



Template.user_login.events({
  "change #pwd": function(event, template){
    var PwdValue = template.$("#pwd").val();
    Session.set("selectval",PwdValue); 
    console.log(PwdValue);  
  } 
});

Template.user_login.events({
  "click .log_form": function(event, template){
     var username_reg = Register.find().fetch();
     console.log(username_reg);
  } 
});



if(Meteor.isServer) {

}
}


