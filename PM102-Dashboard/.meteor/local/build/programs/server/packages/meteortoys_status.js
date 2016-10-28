(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

/* Package-scope variables */
var ToyKit, MeteorToys;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_status/config/config.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "Status",
	version:  "1.0.0",
	template: "MeteorToys_status",
	ToyKit:   "1.0.0"
};

Meteor.startup(function() {

	MeteorToys = Package["meteortoys:toykit"].MeteorToys;

	// MeteorToys.register({
	// 	package:  "meteortoys:status",
	// 	name:     "Status",
	// 	template: "MeteorToys_status",
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


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:status'] = {}, {
  ToyKit: ToyKit
});

})();
