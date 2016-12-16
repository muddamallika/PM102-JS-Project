if(Meteor.isClient){


Template.register.events({
    'submit .register-form': function (event) {

        event.preventDefault();


        var email = event.target.email.value;
        var password = event.target.password.value;
        var firstname = event.target.firstname.value;
        var lastname = event.target.lastname.value;


        var user = {email:email,password:password,profile:{name:firstname +" "+lastname}};



        Accounts.createUser(user,function(err){
            if(err) {
                FlashMessages.sendError("Already user exist. Go and try to login");
            }
            else {
              
            	FlashMessages.sendSuccess("Successfully Registered");

              Register_Search.insert({
                       firstname :firstname,
                       lastname:lastname,
                       email: email,
                       usrId: Meteor.userId()
                });

            }
        });


        event.target.email.value="";
        event.target.password.value="";
        event.target.firstname.value="";
        event.target.lastname.value="";
        Meteor.setTimeout(function () {
            Router.go('/login');
        }, 8000);
    }

});

}
