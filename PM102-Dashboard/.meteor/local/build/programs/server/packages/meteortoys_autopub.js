(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_autopub/config/config.js                      //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "AutoPub",
	version:  "1.0.0",
	template: "MeteorToys_autopub",
	ToyKit:   "1.0.0"
};

// Meteor.startup(function() {

// 	MeteorToys = Package["meteortoys:toykit"].MeteorToys;

// 	MeteorToys.register({
// 		package:  "meteortoys:autopub",
// 		name:     "AutoPub",
// 		template: "MeteorToys_autopub",
// 		core:     true
// 	})

// });
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_autopub/server/main.js                        //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0xdcfe=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x66\x69\x6E\x64\x4F\x6E\x65","\x41\x75\x74\x6F\x50\x75\x62","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x72\x65\x6D\x6F\x76\x65","\x69\x6E\x73\x65\x72\x74","\x6D\x65\x74\x68\x6F\x64\x73"];Meteor[_0xdcfe[8]]({MeteorToys_autopub:function(){var _0x5811x1=false;Meteor[_0xdcfe[1]](_0xdcfe[0],function(_0x5811x2,_0x5811x3){_0x5811x1=_0x5811x3});if(!_0x5811x1){return false};if(Package[_0xdcfe[5]][_0xdcfe[4]][_0xdcfe[3]][_0xdcfe[2]]()){Package[_0xdcfe[5]][_0xdcfe[4]][_0xdcfe[3]][_0xdcfe[6]]({})}else {Package[_0xdcfe[5]][_0xdcfe[4]][_0xdcfe[3]][_0xdcfe[7]]({"\x61\x75\x74\x6F\x70\x75\x62":true})}}})
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:autopub'] = {}, {
  ToyKit: ToyKit
});

})();
