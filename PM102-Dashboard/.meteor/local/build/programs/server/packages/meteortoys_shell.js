(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit, MeteorToys;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_shell/server/main.js                          //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0x2242=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x54\x6F\x20\x65\x6E\x61\x62\x6C\x65\x20\x53\x68\x65\x6C\x6C\x2C\x20\x79\x6F\x75\x20\x6D\x75\x73\x74\x20\x73\x65\x74\x20\x4D\x45\x54\x45\x4F\x52\x54\x4F\x59\x53\x53\x48\x45\x4C\x4C\x20\x61\x73\x20\x74\x72\x75\x65\x20\x6F\x6E\x20\x74\x68\x65\x20\x73\x65\x72\x76\x65\x72\x2E","\x28\x66\x75\x6E\x63\x74\x69\x6F\x6E\x28\x29\x20\x7B","\x7D\x29\x28\x29\x3B","\x6D\x65\x74\x68\x6F\x64\x73"];Meteor[_0x2242[6]]({MeteorToys_Shell:function(_0x84bbx1){check(_0x84bbx1,Match.Any);var _0x84bbx2=false;Meteor[_0x2242[1]](_0x2242[0],function(_0x84bbx3,_0x84bbx4){_0x84bbx2=_0x84bbx4});if(!_0x84bbx2){return};if( typeof METEORTOYSSHELL===_0x2242[2]){return _0x2242[3]}else {if(METEORTOYSSHELL){return eval(_0x2242[4]+_0x84bbx1+_0x2242[5])}}}})
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_shell/config/config.js                        //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "Shell",
	template: "MeteorToys_shell",
	type:     "orb",
	// onOpen: function () {
	// 	alert("yo mofuker");
	// },
	// onClose: function () {
	// 	// do nothing
	// }
};



Meteor.startup(function() {

	MeteorToys = Package["meteortoys:toykit"].MeteorToys;


});
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:shell'] = {}, {
  ToyKit: ToyKit
});

})();
