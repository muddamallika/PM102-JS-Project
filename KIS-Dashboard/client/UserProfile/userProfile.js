if(Meteor.isClient){
 /* Helper to fetch the details of current user from Register_Search collection*/
  Template.userProfile.helpers({
    register_search: function() {
    var current_Userid= Meteor.userId();
    if (Register_Search.find({usrId : current_Userid}).count()==1)
    return Register_Search.find({usrId: current_Userid}).fetch();
  }
  });

  /* Event to get the entered data from the edit profile form*/
  Template.editProfile.events({
    'submit .editprofileui': function (event){
        event.preventDefault();
        var phone = event.target.phone.value;
        var address = event.target.address.value;
        var city = event.target.city.value;
        var gender = event.target.gender.value;
        var birthday = event.target.birthday.value;
        var timestamp = new Date();

        /* Inserting the entered data from form into Register_Update collection*/
        Register_Update.insert({
          phone : phone,
          address : address,
          city : city,
          gender : gender,
          birthday : birthday,
          usrid: Meteor.userId(),
          time: timestamp
        });


        /* Initializing the form value to null again */
        event.target.phone.value = "";
        event.target.address.value = "";
        event.target.city.value = "";
        event.target.gender.value = "";
        event.target.birthday.value = "";
        /* Routing back to user profile page from edit profile page*/
        Meteor.setTimeout(function () {
            Router.go('/userProfile');
        }, 2000);
    }
  });
  /* Helper to display currentuser details from Register_Update collection*/
  Template.userProfile.helpers({
    register_update: function() {
    var curr_Userid= Meteor.userId();
    return Register_Update.find({usrid: curr_Userid}).fetch();

  }
  });


}
