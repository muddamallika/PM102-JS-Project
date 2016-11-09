
Router.configure({
    layoutTemplate: 'footer'
});






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



// Posting Events

Router.route('/Events/event', function() {
    this.render('event')
});

//Events_tab

Router.route('/tdos/:_id', {
   template: 'event_tab',
   data: function(){
       var currentList = this.params._id;
       return Tdos.findOne({ _id: currentList });
   }
});

Router.route('/Event_new/event_new',function(){
this.render('event_new')
});

<<<<<<< HEAD
//Articles_Sel
Router.route('/Articles/Articles_Sel',function(){
this.render('Articles_Sel')
});




=======
>>>>>>> refs/remotes/origin/master
//read Article
Router.route('/readArticle/rArticle', function() {
    this.render('rArticle');
});


Router.route('/public', function(){
    this.render();

});

//Contact Us
Router.route('/contact/contactus', function() {
    this.render('contactus');
});

//About Us
Router.route('/aboutUs/aboutus', function() {
    this.render('aboutus');
});


//Post Article
Router.route('/postArticle/pArticle', function() {
	this.render('pArticle');
});

//Articles_Sel
Router.route('/Articles/Articles_Sel', function() {
	this.render('Articles_Sel');
});

