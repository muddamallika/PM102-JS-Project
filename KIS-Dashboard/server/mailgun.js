Meteor.startup(function() {
    Meteor.methods({
        emailFeedback: function (body, any_variable) {

            // Don't wait for result
            this.unblock();

            // Define the settings
            var postURL = process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages';
            var options =   {
                                auth: "api:" + process.env.MAILGUN_API_KEY,
                                params: {
                                    "from":"sravanece222@gmail.com",
                                    "to":['muddamallika149189@gmail.com'],
                                    "subject": 'movieatmyplace.com quick feedback',
                                    "html": body,
                                }
                            }
            var onError = function(error, result) {
                              if(error) {console.log("Error: " + error)}
                          }

            // Send the request
            Meteor.http.post(postURL, options, onError);
        },
    });
});
