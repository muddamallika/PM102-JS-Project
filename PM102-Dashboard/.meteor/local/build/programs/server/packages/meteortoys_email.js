(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit, MeteorToys;

(function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/meteortoys_email/server/main.js                               //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
var OriginalEmailFunction = Email.send;

Email.send = function (options) {
    
    // Wrap and prep
    var instance      = new OriginalEmailFunction(options);
    options.timestamp = new Date();
    options.unread    = true;

   	// Insert to database
    Package['meteortoys:toykit'].MeteorToysData["Email"].insert(options);

    // Boom
    return instance;

};
////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////
//                                                                        //
// packages/meteortoys_email/config/config.js                             //
//                                                                        //
////////////////////////////////////////////////////////////////////////////
                                                                          //
ToyKit = {
	name:     "Email",
	version:  "1.0.0",
	template: "MeteorToys_email",
	ToyKit:   "1.0.0"
};

Meteor.startup(function() {

	MeteorToys = Package["meteortoys:toykit"].MeteorToys;

	// MeteorToys.register({
	// 	package:  "meteortoys:email",
	// 	name:     "Email",
	// 	template: "MeteorToys_email",
	// 	core:     true
	// })

});
////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:email'] = {}, {
  ToyKit: ToyKit
});

})();
