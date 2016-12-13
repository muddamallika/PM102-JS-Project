
if (Meteor.isClient){
  Template.discFetch.helpers({
    forum: function() {
      return Forum.find();
    }
});
}
