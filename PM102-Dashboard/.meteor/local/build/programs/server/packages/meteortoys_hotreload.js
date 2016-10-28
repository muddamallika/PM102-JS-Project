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
// packages/meteortoys_hotreload/config/config.js                    //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "Hot Reload",
	version:  "1.0.0",
	template: "MeteorToys_reload"
};

Meteor.startup(function() {

	MeteorToys = Package["meteortoys:toykit"].MeteorToys;

	// MeteorToys.register({
	// 	package:  "meteortoys:hotreload",
	// 	name:     "Hot Reload",
	// 	template: "MeteorToys_reload",
	// 	core:     true
	// })

});
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:hotreload'] = {}, {
  ToyKit: ToyKit
});

})();
