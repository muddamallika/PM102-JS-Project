if(Meteor.isClient) {
//
Template.answersFetch.helpers({
  answer: function() {
  	var currentList = this._id;
    console.log(currentList);
    return Answer.find({ discId: currentList });
  }
});
}
