if(Meteor.isClient) {

Template.Article.helpers({
	articles: function() {
		return [
		{
			label: "Article posting has been so succesiful in the Triond.....soon gona join the club and enhance my article posting which are under my blog......www.propertyleo.com/blog",
			name: "Sravan"
		},
		{
			label: "Get Cat food",
			name: "flyer"
		},
		{
			label: "Wash the car",
			name: "sfd"
		}
		]
	}
});
}