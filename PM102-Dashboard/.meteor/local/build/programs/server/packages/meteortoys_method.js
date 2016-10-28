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
// packages/meteortoys_method/ToyKit/main.js                                            //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
// Modify this object

ToyKit = {
	name:     "Method",
	version:  "1.0.0",
	template: "MeteorToys_Method"
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
// packages/meteortoys_method/server/main.js                                            //
//                                                                                      //
//////////////////////////////////////////////////////////////////////////////////////////
                                                                                        //
var _0x5425=["\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x6D\x65\x74\x68\x6F\x64\x73","\x6B\x65\x79\x73","\x6C\x65\x6E\x67\x74\x68","\x73\x75\x62\x73\x74\x72","\x73\x70\x6C\x69\x63\x65","\x4D\x6F\x6E\x67\x6F\x6C","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79","\x4A\x65\x74\x53\x65\x74\x74\x65\x72","\x76\x65\x6C\x6F\x63\x69\x74\x79","\x6C\x6F\x67\x6F\x75\x74\x4F\x74\x68\x65\x72\x43\x6C\x69\x65\x6E\x74\x73","\x72\x65\x6D\x6F\x76\x65\x4F\x74\x68\x65\x72\x54\x6F\x6B\x65\x6E\x73","\x63\x6F\x6E\x66\x69\x67\x75\x72\x65\x4C\x6F\x67\x69\x6E\x53\x65\x72\x76\x69\x63\x65","\x2F","\x6C\x6F\x67\x69\x6E","\x6C\x6F\x67\x6F\x75\x74","\x67\x65\x74\x4E\x65\x77\x54\x6F\x6B\x65\x6E","\x63\x68\x61\x6E\x67\x65\x50\x61\x73\x73\x77\x6F\x72\x64","\x66\x6F\x72\x67\x6F\x74\x50\x61\x73\x73\x77\x6F\x72\x64","\x76\x65\x72\x69\x66\x79\x45\x6D\x61\x69\x6C","\x63\x72\x65\x61\x74\x65\x55\x73\x65\x72","\x72\x65\x73\x65\x74\x50\x61\x73\x73\x77\x6F\x72\x64","\x2F\x75\x70\x64\x61\x74\x65","\x6D\x65\x74\x68\x6F\x64\x5F\x68\x61\x6E\x64\x6C\x65\x72\x73","\x73\x65\x72\x76\x65\x72","\x69\x6E\x64\x65\x78\x4F\x66","\x2F\x6D\x65\x74\x65\x6F\x72","\x2F\x69\x6E\x73\x65\x72\x74","\x2F\x72\x65\x6D\x6F\x76\x65","\x4D\x65\x74\x65\x6F\x72\x2E","\x6D\x61\x74\x63\x68","\x28","\x29","\x73\x6C\x69\x63\x65"];Meteor[_0x5425[2]]({MeteorToy_4:function(_0xa038x1){check(argument,Match.Any);var _0xa038x2=false;Meteor[_0x5425[1]](_0x5425[0],function(_0xa038x3,_0xa038x4){_0xa038x2=_0xa038x4});if(!_0xa038x2){return false};var _0xa038x5=Object[_0x5425[3]](Meteor[_0x5425[2]]);var _0xa038x6=function(_0xa038x7,_0xa038x8){var _0xa038x9=_0xa038x8[_0x5425[4]];for(var _0xa038xa=0;_0xa038xa<_0xa038x7[_0x5425[4]];_0xa038xa++){if(_0xa038x7[_0xa038xa][_0x5425[5]](0,_0xa038x9)===_0xa038x8){_0xa038x7[_0x5425[6]](_0xa038xa,1);_0xa038xa--}};return _0xa038x7};_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[7]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[8]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[9]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[10]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[11]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[12]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[13]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[14]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[15]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[16]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[17]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[18]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[19]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[20]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[21]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[22]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[23]);return _0xa038x5},MeteorToys_x:function(_0xa038xb){check(_0xa038xb,Match.Any);var _0xa038x2=false;Meteor[_0x5425[1]](_0x5425[0],function(_0xa038x3,_0xa038x4){_0xa038x2=_0xa038x4});if(!_0xa038x2){return false};var _0xa038x5=Object[_0x5425[3]](Meteor[_0x5425[25]][_0x5425[24]]);var _0xa038x6=function(_0xa038x7,_0xa038x8){var _0xa038x9=_0xa038x8[_0x5425[4]];for(var _0xa038xa=0;_0xa038xa<_0xa038x7[_0x5425[4]];_0xa038xa++){if(_0xa038x7[_0xa038xa][_0x5425[26]](_0xa038x8)> -1){_0xa038x7[_0x5425[6]](_0xa038xa,1);_0xa038xa--}};return _0xa038x7};var _0xa038xc=function(_0xa038x7,_0xa038x8){var _0xa038x9=_0xa038x8[_0x5425[4]];for(var _0xa038xa=0;_0xa038xa<_0xa038x7[_0x5425[4]];_0xa038xa++){if(_0xa038x7[_0xa038xa]===_0xa038x8){_0xa038x7[_0x5425[6]](_0xa038xa,1);_0xa038xa--}};return _0xa038x7};_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[7]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[8]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[9]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[10]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[27]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[23]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[28]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[29]);_0xa038x5=_0xa038x6(_0xa038x5,_0x5425[30]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[16]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[11]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[12]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[13]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[15]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[17]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[18]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[19]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[20]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[21]);_0xa038x5=_0xa038xc(_0xa038x5,_0x5425[22]);return _0xa038x5},MeteorToy_y:function(_0xa038xd){check(_0xa038xd,Match.Any);var _0xa038x2=false;Meteor[_0x5425[1]](_0x5425[0],function(_0xa038x3,_0xa038x4){_0xa038x2=_0xa038x4});if(!_0xa038x2){return false};function _0xa038xe(_0xa038xf){var _0xa038x10=_0xa038xf.toString();return _0xa038x10[_0x5425[34]](_0xa038x10[_0x5425[26]](_0x5425[32])+1,_0xa038x10[_0x5425[26]](_0x5425[33]))[_0x5425[31]](/([^\s,]+)/g)}var _0xa038x11=String(Meteor[_0x5425[25]][_0x5425[24]][_0xa038xd]),_0xa038x12=_0xa038xe(_0xa038x11);return _0xa038x12}})
//////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////
//                                                                                      //
// packages/meteortoys_method/lib/main.js                                               //
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
})(Package['meteortoys:method'] = {}, {
  ToyKit: ToyKit
});

})();
