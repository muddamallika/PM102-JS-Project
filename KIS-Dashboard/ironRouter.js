//Router.route('/', function () {
//  this.render('Home', {
//    data: function () { return Items.findOne({_id: this.params._id}); }
//  });
//});

//Home page
Router.route('/', function () {
  this.render('Home');
});


//home Profile
Router.route('/homeProfile/Profile', function() {
	this.render('Profile');
});

//home Profile
Router.route('/bArrival/beforeA', function() {
	this.render('beforeA');
});
