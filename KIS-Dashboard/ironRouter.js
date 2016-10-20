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

//before Arrival
Router.route('/bArrival/beforeA', function() {
	this.render('beforeA');
});

//before Arrival - German Institutes
Router.route('/bAGerman/beforeAGI', function() {
	this.render('beforeAGI');
});

//before Arrival - Procedures and Checklists
Router.route('/bAprocedure/bAproceed', function() {
  this.render('bAproceed');
});


//before Arrival - Accomodation
Router.route('/bAaccomodation/bAaccom', function() {
  this.render('bAaccom');
});

//arrival Arrival
Router.route('/aArrival/afterA', function() {
	this.render('afterA');
});

//during Arrival
Router.route('/dArrival/duringA', function() {
	this.render('duringA');
});



//before Arrival - Travel economically
Router.route('/bAtraveleco/bAtravel', function() {
	this.render('bAtravel');
});

