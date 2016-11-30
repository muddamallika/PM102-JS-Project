
Router.configure({
    layoutTemplate: 'footer'
});


//Home page
Router.route('/', function () {
 this.render('Home');
});

// Contact
Router.route('/Contact', function(){
  this.render('Contact');
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

Router.route('/total_events/:_id', {
   template: 'event_tab',
   data: function(){
       var currentList = this.params._id;
       return Total_Events.findOne({ _id: currentList });
   }
});



Router.route('/Event_new/event_new',function(){
this.render('event_new')
});




Router.route('/public', function(){
    this.render();

});

//About Us Page
Router.route('/aboutus', function() {
    this.render('aboutus');
});





Router.route('/Register/register', function() {
  this.render('register');
});

Router.route('/Login/login', function() {
  this.render('login');
});

Router.route('/Event_cancel/event_cancel', function(){
  this.render('event_cancel');
});

//Assistance on arrival
Router.route('/assistance', function() {
  this.render('assistance');
});

//City Registration
Router.route('/cityreg', function() {
  this.render('cityreg');
});

//College information
Router.route('/college', function() {
  this.render('college');
});

//DSL Connection
Router.route('/dsl', function() {
  this.render('dsl');
});


// Food Facts
Router.route('/foodfact', function() {
  this.render('foodfact');
});


// Insurance information
Router.route('/insurance', function() {
  this.render('insurance');
});

//Mobile Contracts and Connections information
Router.route('/mobile', function() {
  this.render('mobile');
});


//Shopping Details
Router.route('/shopping', function() {
  this.render('shopping');
});

//Temperory Accomodation info
Router.route('/tempaccom', function() {
  this.render('tempaccom');
});

//Account Profile Page
Router.route('/accountHome', function() {
  this.render('accountHome');
});



//Arrival Main Page
Router.route('/MainArrival', function() {
  this.render('MainArrival');
});


//Arrival - On the Road Page
Router.route('/ontheroad', function() {
  this.render('ontheroad');
});



//Find friends
Router.route('/Friends/search', function() {
    this.render('search');
});

//Public Profile
Router.route('/register_search/:_id', {
   template: 'publicprofile',
   data: function(){
       var currentList = this.params._id;
       return Register_Search.findOne({ _id: currentList });
}
});


//Before Arrival Landing Page
Router.route('/before', function() {
  this.render('before');
});

//During Arrival Landing Page
Router.route('/during', function() {
  this.render('during');

});




//Article Home

Router.route('/ArticleHome/ArticleHome',function(){
this.render('ArticleHome')
});

//View all Article

Router.route('/Articles/Articles_Sel',function(){
this.render('Articles_Sel')
});

//View my Article

Router.route('/myArticle/myArticle',function(){
this.render('myArticle')
});

//Post Article
Router.route('/postArticle/pArticle', function() {
	this.render('pArticle');
});


//read Article (optional)
Router.route('/readArticles/rArticle', function() {
    this.render('rArticle');
});

Router.route('/readArticle/:_id', {
   template: 'readArticle',
   data: function(){
       var currentArticle = this.params._id;
       return Articles.findOne({ _id: currentArticle });
   }
});
//after Arrival Landing Page
Router.route('/after', function() {
  this.render('after');
});


Router.route('/Events/my_events', function() {
  this.render('my_events');

});

Router.route('Event_cancel/regis_events/:_id', {
   template: 'cancel_event',
   data: function(){
       var currentList = this.params._id;
       return Regis_Events.findOne({ _id: currentList });
}
});

//Events Main Page
Router.route('/eventsMain', function() {
    this.render('eventsMain');
});

//Create Event Page
Router.route('/createEvent', function() {
  this.render('createEvent');
});

//Event Detail Page
Router.route('/eventDetail',function(){
this.render('eventDetail')
});

//My Events Page
Router.route('/myEventsMain', function() {
    this.render('myEventsMain');
});

//My Events Page
Router.route('/myRegEvents', function() {
    this.render('myRegEvents');
});

//My Events Page
Router.route('/myCreateEvents', function() {
    this.render('myCreateEvents');
});

//Articles Main Home Page
Router.route('/articleMain', function() {
  this.render('articleMain');
});

//Post Article Page
Router.route('/postArticles', function() {
  this.render('postArticles');
});

//View All Articles Page
Router.route('/viewAllArticles', function(){
  this.render('/viewAllArticles');
});
