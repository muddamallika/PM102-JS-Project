//Router.route('/', function () {
//  this.render('Home', {
//    data: function () { return Items.findOne({_id: this.params._id}); }
//  });
//});

//Home page
Router.route('/', function () {
  this.render('Home');
});

//About page
Router.route('/About', function () {
  this.render('About');
});

Router.route('/Articles', function() {
	this.render('Articles');
});