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

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/meteortoys_pub/ToyKit/main.js                                               //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// Modify this object

ToyKit = {
	name:     "Pub",
	version:  "1.0.0",
	template: "MeteorToys_Pub"
};


// Do not modify the code below here

if (Meteor.isClient) {
	if (Package["meteortoys:toykit"]) {
		// Import Meteor Toys API
		MeteorToys = Package["meteortoys:toykit"].MeteorToys;
	} else {
		MeteorToys = {};
		console.log("For the " + ToyKit.name + " toy to work, you must install Mongol or");
		console.log("the Meteor Toys package. Grab the free edition at http://Meteor.Toys/");
	}
}

//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/meteortoys_pub/server/main.js                                               //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
var _0xda0b=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x70\x75\x62\x6C\x69\x73\x68\x5F\x68\x61\x6E\x64\x6C\x65\x72\x73","\x73\x65\x72\x76\x65\x72","\x6B\x65\x79\x73","\x6C\x65\x6E\x67\x74\x68","\x73\x75\x62\x73\x74\x72","\x73\x70\x6C\x69\x63\x65","\x76\x65\x6C\x6F\x63\x69\x74\x79","\x56\x65\x6C\x6F\x63\x69\x74\x79","\x6D\x61\x74\x63\x68","\x28","\x69\x6E\x64\x65\x78\x4F\x66","\x29","\x73\x6C\x69\x63\x65","\x6D\x65\x74\x68\x6F\x64\x73"];Meteor[_0xda0b[15]]({MeteorToy_d:function(){var _0x5c95x1=false;Meteor[_0xda0b[1]](_0xda0b[0],function(_0x5c95x2,_0x5c95x3){_0x5c95x1=_0x5c95x3});if(!_0x5c95x1){return false};var _0x5c95x4=Object[_0xda0b[4]](Meteor[_0xda0b[3]][_0xda0b[2]]);var _0x5c95x5=function(_0x5c95x6,_0x5c95x7){var _0x5c95x8=_0x5c95x7[_0xda0b[5]];for(var _0x5c95x9=0;_0x5c95x9<_0x5c95x6[_0xda0b[5]];_0x5c95x9++){if(_0x5c95x6[_0x5c95x9][_0xda0b[6]](0,_0x5c95x8)===_0x5c95x7){_0x5c95x6[_0xda0b[7]](_0x5c95x9,1);_0x5c95x9--}};return _0x5c95x6};_0x5c95x4=_0x5c95x5(_0x5c95x4,_0xda0b[0]);_0x5c95x4=_0x5c95x5(_0x5c95x4,_0xda0b[8]);_0x5c95x4=_0x5c95x5(_0x5c95x4,_0xda0b[9]);return _0x5c95x4},MeteorToy_f:function(_0x5c95xa){check(_0x5c95xa,Match.Any);var _0x5c95x1=false;Meteor[_0xda0b[1]](_0xda0b[0],function(_0x5c95x2,_0x5c95x3){_0x5c95x1=_0x5c95x3});if(!_0x5c95x1){return false};function _0x5c95xb(_0x5c95xc){var _0x5c95xd=_0x5c95xc.toString();return _0x5c95xd[_0xda0b[14]](_0x5c95xd[_0xda0b[12]](_0xda0b[11])+1,_0x5c95xd[_0xda0b[12]](_0xda0b[13]))[_0xda0b[10]](/([^\s,]+)/g)}var _0x5c95xe=String(Meteor[_0xda0b[3]][_0xda0b[2]][_0x5c95xa]),_0x5c95xf=_0x5c95xb(_0x5c95xe);return _0x5c95xf}})
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/meteortoys_pub/lib/main.js                                                  //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// If your toy requires a collection,
// please use the suggested name pattern
// so your collections do not show up in
// Meteor Toys or Kadira Debug, and to
// avoid interference with other Meteor Toys
// 
// CollectionName = new Mongo.Collection("MeteorToys/authorName/packageName");
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:pub'] = {}, {
  ToyKit: ToyKit
});

})();
