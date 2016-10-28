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
var DDP = Package['ddp-client'].DDP;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Hook = Package['callback-hook'].Hook;
var Template = Package['templating-runtime'].Template;
var _ = Package.underscore._;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var Spacebars = Package.spacebars.Spacebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Spiderable;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/spiderable/spiderable.js                                                        //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
Spiderable = {};                                                                            // 1
                                                                                            // 2
                                                                                            // 3
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                          //
// packages/spiderable/spiderable_client.js                                                 //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
                                                                                            //
// We want to provide a deteriministic indicator of when the page is 'done'                 // 1
// This is non-trivial: e.g. an infinite stream of tweets is never done.                    // 2
//                                                                                          // 3
// We do this instead:                                                                      // 4
//   We are done sometime after all initial subscriptions are ready                         // 5
//   Initial subscriptions are those started in the top-level script execution,             // 6
//   or from a Meteor.startup callback when Meteor.startup is called in                     // 7
//   top-level script execution.                                                            // 8
//                                                                                          // 9
// Note that we don't guarantee that we won't wait longer than we have to;                  // 10
// extra subscriptions may be made, and extra data past the minimum may be                  // 11
// received.                                                                                // 12
//                                                                                          // 13
// We set this 'started' flag as Package.spiderable.Spiderable._initialSubscriptionsStarted
// This is used by our phantomjs to determine when the subscriptions are started;           // 15
// it then polls until all subscriptions are ready.                                         // 16
                                                                                            // 17
Spiderable._initialSubscriptionsStarted = false;                                            // 18
                                                                                            // 19
Spiderable._onReadyHook = new Hook({                                                        // 20
  debugPrintExceptions: "Spiderable.addReadyCondition callback"                             // 21
});                                                                                         // 22
                                                                                            // 23
// register a new onReady hook for validation                                               // 24
Spiderable.addReadyCondition = function (fn) {                                              // 25
  return Spiderable._onReadyHook.register(fn);                                              // 26
};                                                                                          // 27
                                                                                            // 28
//                                                                                          // 29
// register default hooks                                                                   // 30
                                                                                            // 31
// top level code ready                                                                     // 32
Spiderable.addReadyCondition(function () {                                                  // 33
  // subs & top level code (startup) completed                                              // 34
  return Spiderable._initialSubscriptionsStarted;                                           // 35
})                                                                                          // 36
var startupCallbacksDone = function () {                                                    // 37
  Spiderable._initialSubscriptionsStarted = true;                                           // 38
};                                                                                          // 39
// This extra indirection is how we get called last                                         // 40
var topLevelCodeDone = function () {                                                        // 41
  // We'd like to use Meteor.startup here I think, but docs/behaviour of that is wrong      // 42
  Meteor._setImmediate(function () { startupCallbacksDone(); });                            // 43
};                                                                                          // 44
Meteor.startup(function () { topLevelCodeDone(); });                                        // 45
                                                                                            // 46
// all ddp subs ready                                                                       // 47
Spiderable.addReadyCondition(function () {                                                  // 48
  Tracker.flush();                                                                          // 49
  return DDP._allSubscriptionsReady();                                                      // 50
})                                                                                          // 51
                                                                                            // 52
// run all hooks and return true if they all pass                                           // 53
Spiderable.isReady = function () {                                                          // 54
  var isReady = true;                                                                       // 55
  Spiderable._onReadyHook.each(function (callback) {                                        // 56
    if (callback()) {                                                                       // 57
      return true; // next callback                                                         // 58
    } else {                                                                                // 59
      isReady = false;                                                                      // 60
      return false; // stop immediately                                                     // 61
    }                                                                                       // 62
  });                                                                                       // 63
  return isReady;                                                                           // 64
};                                                                                          // 65
                                                                                            // 66
                                                                                            // 67
//////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.spiderable = {}, {
  Spiderable: Spiderable
});

})();
