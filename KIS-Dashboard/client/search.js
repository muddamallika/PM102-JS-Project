if(Meteor.isClient){

   Template.searchBox.helpers({
   	usersIndex: () => UsersIndex
   });
}