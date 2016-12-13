if(Meteor.isClient){

  Template.userProfile.helpers({
    register_search: function() {
    var current_Userid= Meteor.userId();
    if (Register_Search.find({usrId : current_Userid}).count()==1)
    return Register_Search.find({usrId: current_Userid}).fetch();
  }
  });

  Template.editProfile.events({
    'submit .editprofileui': function (event){
        event.preventDefault();
        var phone = event.target.phone.value;
        var address = event.target.address.value;
        var city = event.target.city.value;
        var gender = event.target.gender.value;
        var timestamp = new Date();

        Register_Update.insert({
          phone : phone,
          address : address,
          city : city,
          gender : gender,
          usrid: Meteor.userId(),
          time: timestamp


        });
        event.target.phone.value = "";
        event.target.address.value = "";
        event.target.city.value = "";
        event.target.gender.value = "";
        Meteor.setTimeout(function () {
            Router.go('/userProfile');
        }, 2000);
    }
  });

  Template.userProfile.helpers({
    register_update: function() {
    var curr_Userid= Meteor.userId();
    return Register_Update.find({usrid: curr_Userid}).fetch();
  }
  });

}
