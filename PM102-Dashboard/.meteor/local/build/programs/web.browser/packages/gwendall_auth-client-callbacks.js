//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var Accounts = Package['accounts-base'].Accounts;

(function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// packages/gwendall_auth-client-callbacks/packages/gwendall_auth-client-c //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
(function () {                                                             // 1
                                                                           // 2
///////////////////////////////////////////////////////////////////////    // 3
//                                                                   //    // 4
// packages/gwendall:auth-client-callbacks/client/lib.js             //    // 5
//                                                                   //    // 6
///////////////////////////////////////////////////////////////////////    // 7
                                                                     //    // 8
Accounts._hooksLogin = Accounts._hooksLogin || [];                   // 1  // 9
Accounts._hooksLogout = Accounts._hooksLogout || [];                 // 2  // 10
                                                                     // 3  // 11
Accounts.onLogin = function(cb) {                                    // 4  // 12
  if (!_.isFunction(cb)) return;                                     // 5  // 13
  Accounts._hooksLogin.push(cb);                                     // 6  // 14
}                                                                    // 7  // 15
                                                                     // 8  // 16
Accounts.onLogout = function(cb) {                                   // 9  // 17
  if (!_.isFunction(cb)) return;                                     // 10
  Accounts._hooksLogout.push(cb);                                    // 11
}                                                                    // 12
                                                                     // 13
Accounts._callHooksLogin = function() {                              // 14
  var self = this;                                                   // 15
  Accounts._hooksLogin.forEach(function(cb) {                        // 16
    cb.apply(self);                                                  // 17
  });                                                                // 18
}                                                                    // 19
                                                                     // 20
Accounts._callHooksLogout = function() {                             // 21
  var self = this;                                                   // 22
  Accounts._hooksLogout.forEach(function(cb) {                       // 23
    cb.apply(self);                                                  // 24
  });                                                                // 25
}                                                                    // 26
                                                                     // 27
Meteor.autorun(function() {                                          // 28
  if (Meteor.userId()) {                                             // 29
    Accounts._callHooksLogin();                                      // 30
  } else {                                                           // 31
    Accounts._callHooksLogout();                                     // 32
  }                                                                  // 33
});                                                                  // 34
                                                                     // 35
///////////////////////////////////////////////////////////////////////    // 44
                                                                           // 45
}).call(this);                                                             // 46
                                                                           // 47
/////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['gwendall:auth-client-callbacks'] = {};

})();
