if(Meteor.isClient){

Template.login.events({
    'submit .login-form': function (event) {
        event.preventDefault();
        var email = event.target.email.value;
        var password = event.target.password.value;
        
        Meteor.loginWithPassword(email,password,function(err){
            if(err) {
            	FlashMessages.sendError("Please check your password and userid");
                
            }
            else
                var loginroute= Router.current().route.getName();
                if(loginroute=='login')
                Router.go('/');   
        });
    }
});

Template.logout.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
    }
});

}