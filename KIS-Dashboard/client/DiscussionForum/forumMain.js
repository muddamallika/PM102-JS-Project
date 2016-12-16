//
if (Meteor.isClient){
  Template.discTitleFetch.helpers({
    forum: function() {
      return Forum.find();
    }
});

Template.discAuthorFetch.helpers({
  forum: function() {
    return Forum.find();
  }
});

Template.discDateFetch.helpers({
  forum: function() {
    return Forum.find();
  }
});
}
