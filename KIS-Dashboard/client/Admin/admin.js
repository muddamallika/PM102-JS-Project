if(Meteor.isClient){

  Template.userProfile.helpers({
    register_search: function() {
    var current_Userid= Meteor.userId();
    if (Register_Search.find({usrId : current_Userid}).count()==1)
    return Register_Search.find({usrId: current_Userid}).fetch();
  }
  });

}
