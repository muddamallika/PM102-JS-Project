(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit, MeteorToys;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_sub/config/config.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "Sub",
	version:  "1.0.0",
	template: "MeteorToys_pubsub",
	ToyKit:   "1.0.0"
};


Meteor.startup(function() {

	MeteorToys = Package["meteortoys:toykit"].MeteorToys;

	// MeteorToys.register({
	// 	package:  "meteortoys:sub",
	// 	name:     "Sub",
	// 	template: "MeteorToys_pubsub",
	// 	core:     true,
	// 	// onOpen:   function () {
	// 	// 	console.log('onOpen');
	// 	// },
	// 	// onClose:  function () {
	// 	// 	console.log('onClose');
	// 	// },
	// })

});
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_sub/server/methods.js                         //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:sub'] = {}, {
  ToyKit: ToyKit
});

})();
