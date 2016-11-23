

if(Meteor.isClient){

Template.searchdb.helpers({
  register_search: function() {
  	var selectval=Session.get("searchValue");
    return Register_Search.find({lastname: selectval},{firstname: selectval}).fetch();
  }
});




Template.search.events({
  "keyup form": function(event, template){
    var searchValue = template.$("#search").val();
    Session.set("searchValue",searchValue);
    console.log(searchValue);
  }
});



}
