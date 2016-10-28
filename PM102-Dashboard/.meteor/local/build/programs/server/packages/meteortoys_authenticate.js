(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;

/* Package-scope variables */
var accountCount, accounts, toSkip, a, b, c, i, ToyKit;

(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_authenticate/server/methods.js                //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
var _0xbae3=["\x61\x63\x63\x6F\x75\x6E\x74\x73\x2D\x62\x61\x73\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73","\x63\x61\x6C\x6C","\x73\x65\x74\x55\x73\x65\x72\x49\x64","\x75\x73\x65\x72\x49\x64","\x72\x65\x6D\x6F\x76\x65","\x49\x6D\x70\x65\x72\x73\x6F\x6E\x61\x74\x65","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x44\x61\x74\x61","\x6D\x65\x74\x65\x6F\x72\x74\x6F\x79\x73\x3A\x74\x6F\x79\x6B\x69\x74","\x75\x73\x65\x72","\x75\x73\x65\x72\x6E\x61\x6D\x65","\x75\x6E\x64\x65\x66\x69\x6E\x65\x64","\x69\x6E\x73\x65\x72\x74","\x65\x6D\x61\x69\x6C\x73","\x61\x64\x64\x72\x65\x73\x73","\x44\x65\x74\x61\x69\x6C\x73\x20\x6E\x6F\x74\x20\x61\x76\x61\x69\x6C\x61\x62\x6C\x65","\x66\x69\x6E\x64\x4F\x6E\x65","\x63\x6F\x75\x6E\x74","\x66\x69\x6E\x64","\x75\x73\x65\x72\x73","\x66\x65\x74\x63\x68","\x6C\x65\x6E\x67\x74\x68","\x5F\x69\x64","\x6D\x65\x74\x68\x6F\x64\x73","\x4D\x65\x74\x65\x6F\x72\x54\x6F\x79\x73\x5F\x61\x63\x63\x74\x5F\x73\x65\x65\x64","\x73\x74\x61\x72\x74\x75\x70"];Meteor[_0xbae3[23]]({MeteorToys_impersonate:function(_0xa5f4x1){check(_0xa5f4x1,Match.Any);if(!Package[_0xbae3[0]]){return false};var _0xa5f4x2=false;Meteor[_0xbae3[2]](_0xbae3[1],function(_0xa5f4x3,_0xa5f4x4){_0xa5f4x2=_0xa5f4x4});if(!_0xa5f4x2){return false};this[_0xbae3[3]](_0xa5f4x1);return _0xa5f4x1},MeteorToys_impersonate_account:function(){if(Package[_0xbae3[0]]){var _0xa5f4x5=false;Meteor[_0xbae3[2]](_0xbae3[1],function(_0xa5f4x3,_0xa5f4x4){_0xa5f4x5=_0xa5f4x4});if(!_0xa5f4x5){return false};Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[5]]({"\x75\x73\x65\x72\x49\x44":Meteor[_0xbae3[4]]()});if(Meteor[_0xbae3[9]]()){if( typeof Meteor[_0xbae3[9]]()[_0xbae3[10]]!==_0xbae3[11]){Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[12]]({"\x75\x73\x65\x72\x49\x44":Meteor[_0xbae3[4]](),"\x64\x61\x74\x65": new Date(),"\x69\x64\x65\x6E\x74\x69\x66\x69\x65\x72":Meteor[_0xbae3[9]]()[_0xbae3[10]]})}else {if( typeof Meteor[_0xbae3[9]]()[_0xbae3[13]]!==_0xbae3[11]){Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[12]]({"\x75\x73\x65\x72\x49\x44":Meteor[_0xbae3[4]](),"\x64\x61\x74\x65": new Date(),"\x69\x64\x65\x6E\x74\x69\x66\x69\x65\x72":Meteor[_0xbae3[9]]()[_0xbae3[13]][0][_0xbae3[14]]})}else {Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[12]]({"\x75\x73\x65\x72\x49\x44":Meteor[_0xbae3[4]](),"\x64\x61\x74\x65": new Date(),"\x69\x64\x65\x6E\x74\x69\x66\x69\x65\x72":_0xbae3[15]})}}}}},MeteorToys_acct_seed:function(){var _0xa5f4x2=false;Meteor[_0xbae3[2]](_0xbae3[1],function(_0xa5f4x3,_0xa5f4x4){_0xa5f4x2=_0xa5f4x4});if(!_0xa5f4x2){return false};if(!Package[_0xbae3[0]]){return false};if(Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[16]]()){return false};accountCount=Meteor[_0xbae3[19]][_0xbae3[18]]()[_0xbae3[17]]();if(accountCount<=15){accounts=Meteor[_0xbae3[19]][_0xbae3[18]]()[_0xbae3[20]]()}else {toSkip=accountCount-15;accounts=Meteor[_0xbae3[19]][_0xbae3[18]]({},{skip:toSkip})[_0xbae3[20]]()};if(accounts[_0xbae3[21]]===0){return false}else {for(var _0xa5f4x6=0;_0xa5f4x6<accounts[_0xbae3[21]];_0xa5f4x6++){if( typeof accounts[_0xa5f4x6][_0xbae3[10]]!==_0xbae3[11]){Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[12]]({"\x75\x73\x65\x72\x49\x44":accounts[_0xa5f4x6][_0xbae3[22]],"\x64\x61\x74\x65": new Date(),"\x69\x64\x65\x6E\x74\x69\x66\x69\x65\x72":accounts[_0xa5f4x6][_0xbae3[10]]})}else {if( typeof accounts[_0xa5f4x6][_0xbae3[13]]!==_0xbae3[11]){Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[12]]({"\x75\x73\x65\x72\x49\x44":accounts[_0xa5f4x6][_0xbae3[22]],"\x64\x61\x74\x65": new Date(),"\x69\x64\x65\x6E\x74\x69\x66\x69\x65\x72":accounts[_0xa5f4x6][_0xbae3[13]][0][_0xbae3[14]]})}else {Package[_0xbae3[8]][_0xbae3[7]][_0xbae3[6]][_0xbae3[12]]({"\x75\x73\x65\x72\x49\x44":accounts[_0xa5f4x6][_0xbae3[22]],"\x64\x61\x74\x65": new Date(),"\x69\x64\x65\x6E\x74\x69\x66\x69\x65\x72":_0xbae3[15]})}}};return true}},MeteorToys_account_keywords:function(_0xa5f4x1){check(_0xa5f4x1,Match.Any);var _0xa5f4x2=false;Meteor[_0xbae3[2]](_0xbae3[1],function(_0xa5f4x3,_0xa5f4x4){_0xa5f4x2=_0xa5f4x4});if(!_0xa5f4x2){return false};if(!Package[_0xbae3[0]]){return false};a=Meteor[_0xbae3[19]][_0xbae3[16]](_0xa5f4x1);b=Meteor[_0xbae3[19]][_0xbae3[16]]({emails:{$elemMatch:{address:_0xa5f4x1}}});c=Meteor[_0xbae3[19]][_0xbae3[16]]({username:_0xa5f4x1});if(a){return a};if(b){return b[_0xbae3[22]]};if(c){return c[_0xbae3[22]]}else {return false}},MeteorToys_dni:function(_0xa5f4x1){check(_0xa5f4x1,Match.Any);var _0xa5f4x2=false;Meteor[_0xbae3[2]](_0xbae3[1],function(_0xa5f4x3,_0xa5f4x4){_0xa5f4x2=_0xa5f4x4});if(!_0xa5f4x2){return false};if(!Package[_0xbae3[0]]){return false};a=Meteor[_0xbae3[19]][_0xbae3[16]](_0xa5f4x1);b=Meteor[_0xbae3[19]][_0xbae3[16]]({emails:{$elemMatch:{address:_0xa5f4x1}}});c=Meteor[_0xbae3[19]][_0xbae3[16]]({username:_0xa5f4x1});i=false;if(a){i=a[_0xbae3[22]]};if(b){i=b[_0xbae3[22]]};if(c){i=c[_0xbae3[22]]};if(i){this[_0xbae3[3]](i);return i}else {return false}}});Meteor[_0xbae3[25]](function(){if(Package[_0xbae3[0]]){var _0xa5f4x2=false;Meteor[_0xbae3[2]](_0xbae3[1],function(_0xa5f4x3,_0xa5f4x4){_0xa5f4x2=_0xa5f4x4});if(!_0xa5f4x2){return false};Meteor[_0xbae3[2]](_0xbae3[24])}})
///////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

///////////////////////////////////////////////////////////////////////
//                                                                   //
// packages/meteortoys_authenticate/config/config.js                 //
//                                                                   //
///////////////////////////////////////////////////////////////////////
                                                                     //
ToyKit = {
	name:     "Authenticate",
	version:  "1.0.0",
	template: "MeteorToys_accounts",
	ToyKit:   "1.0.0"
};
///////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['meteortoys:authenticate'] = {}, {
  ToyKit: ToyKit
});

})();
