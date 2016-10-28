(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var WebApp = Package.webapp.WebApp;
var main = Package.webapp.main;
var WebAppInternals = Package.webapp.WebAppInternals;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var ToyKit, MeteorToys, doc, tN, dcol, speed, _0x2d10x5;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_throttle/config/config.js                     //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "Throttle",
	version:  "1.0.0",
	template: "MeteorToys_throttle",
	ToyKit:   "1.0.0"
};


Meteor.startup(function() {

	MeteorToys = Package["meteortoys:toykit"].MeteorToys;

	// MeteorToys.register({
	// 	package:  "meteortoys:throttle",
	// 	name:     "Throttle",
	// 	template: "MeteorToys_throttle",
	// 	core:     true
	// })

});
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_throttle/server/main.js                       //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0xc8bd=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x54\x68\x72\x6F\x74\x74\x6C\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x66\x69\x6E\x64\x4F\x6E\x65","\x73\x70\x65\x65\x64","\x75\x70\x64\x61\x74\x65","\x72\x65\x6D\x6F\x76\x65","\x69\x6E\x73\x65\x72\x74","\x6D\x65\x74\x68\x6F\x64\x73","\x6B\x65\x79\x73","\x73\x6C\x69\x63\x65","\x61\x70\x70\x6C\x79","\x73\x65\x72\x76\x65\x72","\x73\x74\x72\x65\x61\x6D\x5F\x73\x65\x72\x76\x65\x72","\x63\x6F\x6E\x6E\x65\x63\x74\x69\x6F\x6E","\x77\x72\x69\x74\x65","\x73\x74\x61\x72\x74\x75\x70"];Meteor[_0xc8bd[10]]({"\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x74\x68\x72\x6F\x74\x74\x6C\x65":function(){var _0x2d10x1=false;Meteor[_0xc8bd[1]](_0xc8bd[0],function(_0x2d10x2,_0x2d10x3){_0x2d10x1=_0x2d10x3});if(!_0x2d10x1){return false};var _0x2d10x4=Package[_0xc8bd[4]][_0xc8bd[3]][_0xc8bd[2]];doc=_0x2d10x4[_0xc8bd[5]]();if(doc){if(doc[_0xc8bd[6]]===600){_0x2d10x4[_0xc8bd[7]](doc._id,{$set:{"\x73\x70\x65\x65\x64":1200}})}else {_0x2d10x4[_0xc8bd[8]]({})}}else {_0x2d10x4[_0xc8bd[9]]({"\x73\x70\x65\x65\x64":600})}},"\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x74\x68\x72\x6F\x74\x74\x6C\x65\x5F\x64\x69\x73\x61\x62\x6C\x65":function(){var _0x2d10x1=false;Meteor[_0xc8bd[1]](_0xc8bd[0],function(_0x2d10x2,_0x2d10x3){_0x2d10x1=_0x2d10x3});if(!_0x2d10x1){return false};var _0x2d10x4=Package[_0xc8bd[4]][_0xc8bd[3]][_0xc8bd[2]];_0x2d10x4[_0xc8bd[8]]({});return true}});Meteor[_0xc8bd[18]](function(){tN=Object[_0xc8bd[11]](Package[_0xc8bd[4]].MeteorToysData)[6];dcol=Package[_0xc8bd[4]][_0xc8bd[3]][tN][_0xc8bd[5]]()||false;if(dcol){speed=dcol[_0xc8bd[6]];_0x2d10x5=function _0x2d10x5(_0x2d10x6,_0x2d10x7,_0x2d10x8){var _0x2d10x9=_0x2d10x6[_0x2d10x7];_0x2d10x6[_0x2d10x7]=function(){var _0x2d10xa=[][_0xc8bd[12]][_0xc8bd[1]](arguments);var _0x2d10xb=this;_0x2d10x8[_0xc8bd[1]](_0x2d10xb,_0x2d10xa,function(_0x2d10xc){_0x2d10x9[_0xc8bd[13]](_0x2d10xb,_0x2d10xc||_0x2d10xa)})}};_0x2d10x5(Meteor[_0xc8bd[14]][_0xc8bd[15]][_0xc8bd[14]]._events,_0xc8bd[16],function(_0x2d10xa,_0x2d10xd){_0x2d10x5(_0x2d10xa[0],_0xc8bd[17],function(_0x2d10xa,_0x2d10xd){setTimeout(_0x2d10xd,speed)});_0x2d10xd()})}})
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:throttle'] = {}, {
  ToyKit: ToyKit
});

})();
