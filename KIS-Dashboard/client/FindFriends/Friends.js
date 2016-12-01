

if(Meteor.isClient){

  Template.searchdb.helpers({
    register_search: function() {
    	var selectval=Session.get("searchValue");
      if(Register_Search.find({firstname: selectval}).count()==0)
      return Register_Search.find({lastname: selectval}).fetch();
      else if(Register_Search.find({lastname: selectval}).count()==0)
        return Register_Search.find({firstname: selectval}).fetch();
        else
          return Register_Search.find({firstname: selectval},{lastname: selectval}).fetch();
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
