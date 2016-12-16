import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Meteor.methods({
    sendEmail: function (userId, email) {
        if (this.userId == userId) {
            Email.send(email);
        }
    }
});
});
