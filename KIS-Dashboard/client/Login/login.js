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

            else {
              var loginroute= Router.current().route.getName();
              if(loginroute=='login')
              Router.go('/');
            }

        });
    }
});

Template.forgotPassword.events({
    'submit #forgotPasswordForm': function(e, t) {
        e.preventDefault();

        var forgotPasswordForm = $(e.currentTarget),
            email = trimInput(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());

        if (isNotEmpty(email) && isEmail(email)) {
            Accounts.forgotPassword({email: email}, function(err) {
                if (err) {
                    if (err.message === 'User not found [403]') {
                        Session.set('alert', 'This email does not exist.');
                    } else {
                        Session.set('alert', 'We\'re sorry but something went wrong.');
                    }
                } else {
                    Session.set('alert', 'Email Sent. Please check your mailbox to reset your password.');

                }
            });
        }
        return false;
    }
});

Template.logout.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('/');
    }
});

}

if(Meteor.isClient){
    Meteor.startup(function () {
    process.env.MAIL_URL="smtp://user%40gmail.com:password@smtp.gmail.com:465"; 
});
}
