(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var EJSON = Package.ejson.EJSON;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Email = Package.email.Email;
var EmailInternals = Package.email.EmailInternals;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"accounts-password":{"email_templates.js":function(){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-password/email_templates.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
function greet(welcomeMsg) {                                                                                           // 1
  return function (user, url) {                                                                                        // 2
    var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";                  // 3
    return greeting + "\n\n" + welcomeMsg + ", simply click the link below.\n\n" + url + "\n\nThanks.\n";              // 5
  };                                                                                                                   // 13
}                                                                                                                      // 14
                                                                                                                       //
/**                                                                                                                    // 16
 * @summary Options to customize emails sent from the Accounts system.                                                 //
 * @locus Server                                                                                                       //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.emailTemplates = {                                                                                            // 21
  from: "Meteor Accounts <no-reply@meteor.com>",                                                                       // 22
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),                                       // 23
                                                                                                                       //
  resetPassword: {                                                                                                     // 25
    subject: function () {                                                                                             // 26
      function subject(user) {                                                                                         // 26
        return "How to reset your password on " + Accounts.emailTemplates.siteName;                                    // 27
      }                                                                                                                // 28
                                                                                                                       //
      return subject;                                                                                                  // 26
    }(),                                                                                                               // 26
    text: function () {                                                                                                // 29
      function text(user, url) {                                                                                       // 29
        var greeting = user.profile && user.profile.name ? "Hello " + user.profile.name + "," : "Hello,";              // 30
        return greeting + "\n\nTo reset your password, simply click the link below.\n\n" + url + "\n\nThanks.\n";      // 32
      }                                                                                                                // 40
                                                                                                                       //
      return text;                                                                                                     // 29
    }()                                                                                                                // 29
  },                                                                                                                   // 25
  verifyEmail: {                                                                                                       // 42
    subject: function () {                                                                                             // 43
      function subject(user) {                                                                                         // 43
        return "How to verify email address on " + Accounts.emailTemplates.siteName;                                   // 44
      }                                                                                                                // 45
                                                                                                                       //
      return subject;                                                                                                  // 43
    }(),                                                                                                               // 43
    text: greet("To verify your account email")                                                                        // 46
  },                                                                                                                   // 42
  enrollAccount: {                                                                                                     // 48
    subject: function () {                                                                                             // 49
      function subject(user) {                                                                                         // 49
        return "An account has been created for you on " + Accounts.emailTemplates.siteName;                           // 50
      }                                                                                                                // 51
                                                                                                                       //
      return subject;                                                                                                  // 49
    }(),                                                                                                               // 49
    text: greet("To start using the service")                                                                          // 52
  }                                                                                                                    // 48
};                                                                                                                     // 21
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"password_server.js":["babel-runtime/helpers/typeof",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/accounts-password/password_server.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
var _typeof;module.import("babel-runtime/helpers/typeof",{"default":function(v){_typeof=v}});                          //
/// BCRYPT                                                                                                             // 1
                                                                                                                       //
var bcrypt = NpmModuleBcrypt;                                                                                          // 3
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);                                                                        // 4
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);                                                                  // 5
                                                                                                                       //
// User records have a 'services.password.bcrypt' field on them to hold                                                // 7
// their hashed passwords (unless they have a 'services.password.srp'                                                  // 8
// field, in which case they will be upgraded to bcrypt the next time                                                  // 9
// they log in).                                                                                                       // 10
//                                                                                                                     // 11
// When the client sends a password to the server, it can either be a                                                  // 12
// string (the plaintext password) or an object with keys 'digest' and                                                 // 13
// 'algorithm' (must be "sha-256" for now). The Meteor client always sends                                             // 14
// password objects { digest: *, algorithm: "sha-256" }, but DDP clients                                               // 15
// that don't have access to SHA can just send plaintext passwords as                                                  // 16
// strings.                                                                                                            // 17
//                                                                                                                     // 18
// When the server receives a plaintext password as a string, it always                                                // 19
// hashes it with SHA256 before passing it into bcrypt. When the server                                                // 20
// receives a password as an object, it asserts that the algorithm is                                                  // 21
// "sha-256" and then passes the digest to bcrypt.                                                                     // 22
                                                                                                                       //
                                                                                                                       //
Accounts._bcryptRounds = 10;                                                                                           // 25
                                                                                                                       //
// Given a 'password' from the client, extract the string that we should                                               // 27
// bcrypt. 'password' can be one of:                                                                                   // 28
//  - String (the plaintext password)                                                                                  // 29
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".                                        // 30
//                                                                                                                     // 31
var getPasswordString = function getPasswordString(password) {                                                         // 32
  if (typeof password === "string") {                                                                                  // 33
    password = SHA256(password);                                                                                       // 34
  } else {                                                                                                             // 35
    // 'password' is an object                                                                                         // 35
    if (password.algorithm !== "sha-256") {                                                                            // 36
      throw new Error("Invalid password hash algorithm. " + "Only 'sha-256' is allowed.");                             // 37
    }                                                                                                                  // 39
    password = password.digest;                                                                                        // 40
  }                                                                                                                    // 41
  return password;                                                                                                     // 42
};                                                                                                                     // 43
                                                                                                                       //
// Use bcrypt to hash the password for storage in the database.                                                        // 45
// `password` can be a string (in which case it will be run through                                                    // 46
// SHA256 before bcrypt) or an object with properties `digest` and                                                     // 47
// `algorithm` (in which case we bcrypt `password.digest`).                                                            // 48
//                                                                                                                     // 49
var hashPassword = function hashPassword(password) {                                                                   // 50
  password = getPasswordString(password);                                                                              // 51
  return bcryptHash(password, Accounts._bcryptRounds);                                                                 // 52
};                                                                                                                     // 53
                                                                                                                       //
// Check whether the provided password matches the bcrypt'ed password in                                               // 55
// the database user record. `password` can be a string (in which case                                                 // 56
// it will be run through SHA256 before bcrypt) or an object with                                                      // 57
// properties `digest` and `algorithm` (in which case we bcrypt                                                        // 58
// `password.digest`).                                                                                                 // 59
//                                                                                                                     // 60
Accounts._checkPassword = function (user, password) {                                                                  // 61
  var result = {                                                                                                       // 62
    userId: user._id                                                                                                   // 63
  };                                                                                                                   // 62
                                                                                                                       //
  password = getPasswordString(password);                                                                              // 66
                                                                                                                       //
  if (!bcryptCompare(password, user.services.password.bcrypt)) {                                                       // 68
    result.error = new Meteor.Error(403, "Incorrect password");                                                        // 69
  }                                                                                                                    // 70
                                                                                                                       //
  return result;                                                                                                       // 72
};                                                                                                                     // 73
var checkPassword = Accounts._checkPassword;                                                                           // 74
                                                                                                                       //
///                                                                                                                    // 76
/// LOGIN                                                                                                              // 77
///                                                                                                                    // 78
                                                                                                                       //
Accounts._findUserByQuery = function (query) {                                                                         // 80
  var user = null;                                                                                                     // 81
                                                                                                                       //
  if (query.id) {                                                                                                      // 83
    user = Meteor.users.findOne({ _id: query.id });                                                                    // 84
  } else {                                                                                                             // 85
    var fieldName;                                                                                                     // 86
    var fieldValue;                                                                                                    // 87
    if (query.username) {                                                                                              // 88
      fieldName = 'username';                                                                                          // 89
      fieldValue = query.username;                                                                                     // 90
    } else if (query.email) {                                                                                          // 91
      fieldName = 'emails.address';                                                                                    // 92
      fieldValue = query.email;                                                                                        // 93
    } else {                                                                                                           // 94
      throw new Error("shouldn't happen (validation missed something)");                                               // 95
    }                                                                                                                  // 96
    var selector = {};                                                                                                 // 97
    selector[fieldName] = fieldValue;                                                                                  // 98
    user = Meteor.users.findOne(selector);                                                                             // 99
    // If user is not found, try a case insensitive lookup                                                             // 100
    if (!user) {                                                                                                       // 101
      selector = selectorForFastCaseInsensitiveLookup(fieldName, fieldValue);                                          // 102
      var candidateUsers = Meteor.users.find(selector).fetch();                                                        // 103
      // No match if multiple candidates are found                                                                     // 104
      if (candidateUsers.length === 1) {                                                                               // 105
        user = candidateUsers[0];                                                                                      // 106
      }                                                                                                                // 107
    }                                                                                                                  // 108
  }                                                                                                                    // 109
                                                                                                                       //
  return user;                                                                                                         // 111
};                                                                                                                     // 112
                                                                                                                       //
/**                                                                                                                    // 114
 * @summary Finds the user with the specified username.                                                                //
 * First tries to match username case sensitively; if that fails, it                                                   //
 * tries case insensitively; but if more than one user matches the case                                                //
 * insensitive search, it returns null.                                                                                //
 * @locus Server                                                                                                       //
 * @param {String} username The username to look for                                                                   //
 * @returns {Object} A user if found, else null                                                                        //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.findUserByUsername = function (username) {                                                                    // 124
  return Accounts._findUserByQuery({                                                                                   // 125
    username: username                                                                                                 // 126
  });                                                                                                                  // 125
};                                                                                                                     // 128
                                                                                                                       //
/**                                                                                                                    // 130
 * @summary Finds the user with the specified email.                                                                   //
 * First tries to match email case sensitively; if that fails, it                                                      //
 * tries case insensitively; but if more than one user matches the case                                                //
 * insensitive search, it returns null.                                                                                //
 * @locus Server                                                                                                       //
 * @param {String} email The email address to look for                                                                 //
 * @returns {Object} A user if found, else null                                                                        //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.findUserByEmail = function (email) {                                                                          // 140
  return Accounts._findUserByQuery({                                                                                   // 141
    email: email                                                                                                       // 142
  });                                                                                                                  // 141
};                                                                                                                     // 144
                                                                                                                       //
// Generates a MongoDB selector that can be used to perform a fast case                                                // 146
// insensitive lookup for the given fieldName and string. Since MongoDB does                                           // 147
// not support case insensitive indexes, and case insensitive regex queries                                            // 148
// are slow, we construct a set of prefix selectors for all permutations of                                            // 149
// the first 4 characters ourselves. We first attempt to matching against                                              // 150
// these, and because 'prefix expression' regex queries do use indexes (see                                            // 151
// http://docs.mongodb.org/v2.6/reference/operator/query/regex/#index-use),                                            // 152
// this has been found to greatly improve performance (from 1200ms to 5ms in a                                         // 153
// test with 1.000.000 users).                                                                                         // 154
var selectorForFastCaseInsensitiveLookup = function selectorForFastCaseInsensitiveLookup(fieldName, string) {          // 155
  // Performance seems to improve up to 4 prefix characters                                                            // 156
  var prefix = string.substring(0, Math.min(string.length, 4));                                                        // 157
  var orClause = _.map(generateCasePermutationsForString(prefix), function (prefixPermutation) {                       // 158
    var selector = {};                                                                                                 // 160
    selector[fieldName] = new RegExp('^' + Meteor._escapeRegExp(prefixPermutation));                                   // 161
    return selector;                                                                                                   // 163
  });                                                                                                                  // 164
  var caseInsensitiveClause = {};                                                                                      // 165
  caseInsensitiveClause[fieldName] = new RegExp('^' + Meteor._escapeRegExp(string) + '$', 'i');                        // 166
  return { $and: [{ $or: orClause }, caseInsensitiveClause] };                                                         // 168
};                                                                                                                     // 169
                                                                                                                       //
// Generates permutations of all case variations of a given string.                                                    // 171
var generateCasePermutationsForString = function generateCasePermutationsForString(string) {                           // 172
  var permutations = [''];                                                                                             // 173
  for (var i = 0; i < string.length; i++) {                                                                            // 174
    var ch = string.charAt(i);                                                                                         // 175
    permutations = _.flatten(_.map(permutations, function (prefix) {                                                   // 176
      var lowerCaseChar = ch.toLowerCase();                                                                            // 177
      var upperCaseChar = ch.toUpperCase();                                                                            // 178
      // Don't add unneccesary permutations when ch is not a letter                                                    // 179
      if (lowerCaseChar === upperCaseChar) {                                                                           // 180
        return [prefix + ch];                                                                                          // 181
      } else {                                                                                                         // 182
        return [prefix + lowerCaseChar, prefix + upperCaseChar];                                                       // 183
      }                                                                                                                // 184
    }));                                                                                                               // 185
  }                                                                                                                    // 186
  return permutations;                                                                                                 // 187
};                                                                                                                     // 188
                                                                                                                       //
var checkForCaseInsensitiveDuplicates = function checkForCaseInsensitiveDuplicates(fieldName, displayName, fieldValue, ownUserId) {
  // Some tests need the ability to add users with the same case insensitive                                           // 191
  // value, hence the _skipCaseInsensitiveChecksForTest check                                                          // 192
  var skipCheck = _.has(Accounts._skipCaseInsensitiveChecksForTest, fieldValue);                                       // 193
                                                                                                                       //
  if (fieldValue && !skipCheck) {                                                                                      // 195
    var matchedUsers = Meteor.users.find(selectorForFastCaseInsensitiveLookup(fieldName, fieldValue)).fetch();         // 196
                                                                                                                       //
    if (matchedUsers.length > 0 && (                                                                                   // 199
    // If we don't have a userId yet, any match we find is a duplicate                                                 // 200
    !ownUserId ||                                                                                                      // 201
    // Otherwise, check to see if there are multiple matches or a match                                                // 202
    // that is not us                                                                                                  // 203
    matchedUsers.length > 1 || matchedUsers[0]._id !== ownUserId)) {                                                   // 204
      throw new Meteor.Error(403, displayName + " already exists.");                                                   // 205
    }                                                                                                                  // 206
  }                                                                                                                    // 207
};                                                                                                                     // 208
                                                                                                                       //
// XXX maybe this belongs in the check package                                                                         // 210
var NonEmptyString = Match.Where(function (x) {                                                                        // 211
  check(x, String);                                                                                                    // 212
  return x.length > 0;                                                                                                 // 213
});                                                                                                                    // 214
                                                                                                                       //
var userQueryValidator = Match.Where(function (user) {                                                                 // 216
  check(user, {                                                                                                        // 217
    id: Match.Optional(NonEmptyString),                                                                                // 218
    username: Match.Optional(NonEmptyString),                                                                          // 219
    email: Match.Optional(NonEmptyString)                                                                              // 220
  });                                                                                                                  // 217
  if (_.keys(user).length !== 1) throw new Match.Error("User property must have exactly one field");                   // 222
  return true;                                                                                                         // 224
});                                                                                                                    // 225
                                                                                                                       //
var passwordValidator = Match.OneOf(String, { digest: String, algorithm: String });                                    // 227
                                                                                                                       //
// Handler to login with a password.                                                                                   // 232
//                                                                                                                     // 233
// The Meteor client sets options.password to an object with keys                                                      // 234
// 'digest' (set to SHA256(password)) and 'algorithm' ("sha-256").                                                     // 235
//                                                                                                                     // 236
// For other DDP clients which don't have access to SHA, the handler                                                   // 237
// also accepts the plaintext password in options.password as a string.                                                // 238
//                                                                                                                     // 239
// (It might be nice if servers could turn the plaintext password                                                      // 240
// option off. Or maybe it should be opt-in, not opt-out?                                                              // 241
// Accounts.config option?)                                                                                            // 242
//                                                                                                                     // 243
// Note that neither password option is secure without SSL.                                                            // 244
//                                                                                                                     // 245
Accounts.registerLoginHandler("password", function (options) {                                                         // 246
  if (!options.password || options.srp) return undefined; // don't handle                                              // 247
                                                                                                                       //
  check(options, {                                                                                                     // 250
    user: userQueryValidator,                                                                                          // 251
    password: passwordValidator                                                                                        // 252
  });                                                                                                                  // 250
                                                                                                                       //
  var user = Accounts._findUserByQuery(options.user);                                                                  // 256
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 257
                                                                                                                       //
  if (!user.services || !user.services.password || !(user.services.password.bcrypt || user.services.password.srp)) throw new Meteor.Error(403, "User has no password set");
                                                                                                                       //
  if (!user.services.password.bcrypt) {                                                                                // 264
    if (typeof options.password === "string") {                                                                        // 265
      // The client has presented a plaintext password, and the user is                                                // 266
      // not upgraded to bcrypt yet. We don't attempt to tell the client                                               // 267
      // to upgrade to bcrypt, because it might be a standalone DDP                                                    // 268
      // client doesn't know how to do such a thing.                                                                   // 269
      var verifier = user.services.password.srp;                                                                       // 270
      var newVerifier = SRP.generateVerifier(options.password, {                                                       // 271
        identity: verifier.identity, salt: verifier.salt });                                                           // 272
                                                                                                                       //
      if (verifier.verifier !== newVerifier.verifier) {                                                                // 274
        return {                                                                                                       // 275
          userId: user._id,                                                                                            // 276
          error: new Meteor.Error(403, "Incorrect password")                                                           // 277
        };                                                                                                             // 275
      }                                                                                                                // 279
                                                                                                                       //
      return { userId: user._id };                                                                                     // 281
    } else {                                                                                                           // 282
      // Tell the client to use the SRP upgrade process.                                                               // 283
      throw new Meteor.Error(400, "old password format", EJSON.stringify({                                             // 284
        format: 'srp',                                                                                                 // 285
        identity: user.services.password.srp.identity                                                                  // 286
      }));                                                                                                             // 284
    }                                                                                                                  // 288
  }                                                                                                                    // 289
                                                                                                                       //
  return checkPassword(user, options.password);                                                                        // 291
});                                                                                                                    // 295
                                                                                                                       //
// Handler to login using the SRP upgrade path. To use this login                                                      // 297
// handler, the client must provide:                                                                                   // 298
//   - srp: H(identity + ":" + password)                                                                               // 299
//   - password: a string or an object with properties 'digest' and 'algorithm'                                        // 300
//                                                                                                                     // 301
// We use `options.srp` to verify that the client knows the correct                                                    // 302
// password without doing a full SRP flow. Once we've checked that, we                                                 // 303
// upgrade the user to bcrypt and remove the SRP information from the                                                  // 304
// user document.                                                                                                      // 305
//                                                                                                                     // 306
// The client ends up using this login handler after trying the normal                                                 // 307
// login handler (above), which throws an error telling the client to                                                  // 308
// try the SRP upgrade path.                                                                                           // 309
//                                                                                                                     // 310
// XXX COMPAT WITH 0.8.1.3                                                                                             // 311
Accounts.registerLoginHandler("password", function (options) {                                                         // 312
  if (!options.srp || !options.password) return undefined; // don't handle                                             // 313
                                                                                                                       //
  check(options, {                                                                                                     // 316
    user: userQueryValidator,                                                                                          // 317
    srp: String,                                                                                                       // 318
    password: passwordValidator                                                                                        // 319
  });                                                                                                                  // 316
                                                                                                                       //
  var user = Accounts._findUserByQuery(options.user);                                                                  // 322
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 323
                                                                                                                       //
  // Check to see if another simultaneous login has already upgraded                                                   // 326
  // the user record to bcrypt.                                                                                        // 327
  if (user.services && user.services.password && user.services.password.bcrypt) return checkPassword(user, options.password);
                                                                                                                       //
  if (!(user.services && user.services.password && user.services.password.srp)) throw new Meteor.Error(403, "User has no password set");
                                                                                                                       //
  var v1 = user.services.password.srp.verifier;                                                                        // 334
  var v2 = SRP.generateVerifier(null, {                                                                                // 335
    hashedIdentityAndPassword: options.srp,                                                                            // 338
    salt: user.services.password.srp.salt                                                                              // 339
  }).verifier;                                                                                                         // 337
  if (v1 !== v2) return {                                                                                              // 342
    userId: user._id,                                                                                                  // 344
    error: new Meteor.Error(403, "Incorrect password")                                                                 // 345
  };                                                                                                                   // 343
                                                                                                                       //
  // Upgrade to bcrypt on successful login.                                                                            // 348
  var salted = hashPassword(options.password);                                                                         // 349
  Meteor.users.update(user._id, {                                                                                      // 350
    $unset: { 'services.password.srp': 1 },                                                                            // 353
    $set: { 'services.password.bcrypt': salted }                                                                       // 354
  });                                                                                                                  // 352
                                                                                                                       //
  return { userId: user._id };                                                                                         // 358
});                                                                                                                    // 359
                                                                                                                       //
///                                                                                                                    // 362
/// CHANGING                                                                                                           // 363
///                                                                                                                    // 364
                                                                                                                       //
/**                                                                                                                    // 366
 * @summary Change a user's username. Use this instead of updating the                                                 //
 * database directly. The operation will fail if there is an existing user                                             //
 * with a username only differing in case.                                                                             //
 * @locus Server                                                                                                       //
 * @param {String} userId The ID of the user to update.                                                                //
 * @param {String} newUsername A new username for the user.                                                            //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.setUsername = function (userId, newUsername) {                                                                // 375
  check(userId, NonEmptyString);                                                                                       // 376
  check(newUsername, NonEmptyString);                                                                                  // 377
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 379
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 380
                                                                                                                       //
  var oldUsername = user.username;                                                                                     // 383
                                                                                                                       //
  // Perform a case insensitive check for duplicates before update                                                     // 385
  checkForCaseInsensitiveDuplicates('username', 'Username', newUsername, user._id);                                    // 386
                                                                                                                       //
  Meteor.users.update({ _id: user._id }, { $set: { username: newUsername } });                                         // 388
                                                                                                                       //
  // Perform another check after update, in case a matching user has been                                              // 390
  // inserted in the meantime                                                                                          // 391
  try {                                                                                                                // 392
    checkForCaseInsensitiveDuplicates('username', 'Username', newUsername, user._id);                                  // 393
  } catch (ex) {                                                                                                       // 394
    // Undo update if the check fails                                                                                  // 395
    Meteor.users.update({ _id: user._id }, { $set: { username: oldUsername } });                                       // 396
    throw ex;                                                                                                          // 397
  }                                                                                                                    // 398
};                                                                                                                     // 399
                                                                                                                       //
// Let the user change their own password if they know the old                                                         // 401
// password. `oldPassword` and `newPassword` should be objects with keys                                               // 402
// `digest` and `algorithm` (representing the SHA256 of the password).                                                 // 403
//                                                                                                                     // 404
// XXX COMPAT WITH 0.8.1.3                                                                                             // 405
// Like the login method, if the user hasn't been upgraded from SRP to                                                 // 406
// bcrypt yet, then this method will throw an 'old password format'                                                    // 407
// error. The client should call the SRP upgrade login handler and then                                                // 408
// retry this method again.                                                                                            // 409
//                                                                                                                     // 410
// UNLIKE the login method, there is no way to avoid getting SRP upgrade                                               // 411
// errors thrown. The reasoning for this is that clients using this                                                    // 412
// method directly will need to be updated anyway because we no longer                                                 // 413
// support the SRP flow that they would have been doing to use this                                                    // 414
// method previously.                                                                                                  // 415
Meteor.methods({ changePassword: function () {                                                                         // 416
    function changePassword(oldPassword, newPassword) {                                                                // 416
      check(oldPassword, passwordValidator);                                                                           // 417
      check(newPassword, passwordValidator);                                                                           // 418
                                                                                                                       //
      if (!this.userId) throw new Meteor.Error(401, "Must be logged in");                                              // 420
                                                                                                                       //
      var user = Meteor.users.findOne(this.userId);                                                                    // 423
      if (!user) throw new Meteor.Error(403, "User not found");                                                        // 424
                                                                                                                       //
      if (!user.services || !user.services.password || !user.services.password.bcrypt && !user.services.password.srp) throw new Meteor.Error(403, "User has no password set");
                                                                                                                       //
      if (!user.services.password.bcrypt) {                                                                            // 431
        throw new Meteor.Error(400, "old password format", EJSON.stringify({                                           // 432
          format: 'srp',                                                                                               // 433
          identity: user.services.password.srp.identity                                                                // 434
        }));                                                                                                           // 432
      }                                                                                                                // 436
                                                                                                                       //
      var result = checkPassword(user, oldPassword);                                                                   // 438
      if (result.error) throw result.error;                                                                            // 439
                                                                                                                       //
      var hashed = hashPassword(newPassword);                                                                          // 442
                                                                                                                       //
      // It would be better if this removed ALL existing tokens and replaced                                           // 444
      // the token for the current connection with a new one, but that would                                           // 445
      // be tricky, so we'll settle for just replacing all tokens other than                                           // 446
      // the one for the current connection.                                                                           // 447
      var currentToken = Accounts._getLoginToken(this.connection.id);                                                  // 448
      Meteor.users.update({ _id: this.userId }, {                                                                      // 449
        $set: { 'services.password.bcrypt': hashed },                                                                  // 452
        $pull: {                                                                                                       // 453
          'services.resume.loginTokens': { hashedToken: { $ne: currentToken } }                                        // 454
        },                                                                                                             // 453
        $unset: { 'services.password.reset': 1 }                                                                       // 456
      });                                                                                                              // 451
                                                                                                                       //
      return { passwordChanged: true };                                                                                // 460
    }                                                                                                                  // 461
                                                                                                                       //
    return changePassword;                                                                                             // 416
  }() });                                                                                                              // 416
                                                                                                                       //
// Force change the users password.                                                                                    // 464
                                                                                                                       //
/**                                                                                                                    // 466
 * @summary Forcibly change the password for a user.                                                                   //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to update.                                                                //
 * @param {String} newPassword A new password for the user.                                                            //
 * @param {Object} [options]                                                                                           //
 * @param {Object} options.logout Logout all current connections with this userId (default: true)                      //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.setPassword = function (userId, newPlaintextPassword, options) {                                              // 475
  options = _.extend({ logout: true }, options);                                                                       // 476
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 478
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 479
                                                                                                                       //
  var update = {                                                                                                       // 482
    $unset: {                                                                                                          // 483
      'services.password.srp': 1, // XXX COMPAT WITH 0.8.1.3                                                           // 484
      'services.password.reset': 1                                                                                     // 485
    },                                                                                                                 // 483
    $set: { 'services.password.bcrypt': hashPassword(newPlaintextPassword) }                                           // 487
  };                                                                                                                   // 482
                                                                                                                       //
  if (options.logout) {                                                                                                // 490
    update.$unset['services.resume.loginTokens'] = 1;                                                                  // 491
  }                                                                                                                    // 492
                                                                                                                       //
  Meteor.users.update({ _id: user._id }, update);                                                                      // 494
};                                                                                                                     // 495
                                                                                                                       //
///                                                                                                                    // 498
/// RESETTING VIA EMAIL                                                                                                // 499
///                                                                                                                    // 500
                                                                                                                       //
// Method called by a user to request a password reset email. This is                                                  // 502
// the start of the reset process.                                                                                     // 503
Meteor.methods({ forgotPassword: function () {                                                                         // 504
    function forgotPassword(options) {                                                                                 // 504
      check(options, { email: String });                                                                               // 505
                                                                                                                       //
      var user = Accounts.findUserByEmail(options.email);                                                              // 507
      if (!user) throw new Meteor.Error(403, "User not found");                                                        // 508
                                                                                                                       //
      var emails = _.pluck(user.emails || [], 'address');                                                              // 511
      var caseSensitiveEmail = _.find(emails, function (email) {                                                       // 512
        return email.toLowerCase() === options.email.toLowerCase();                                                    // 513
      });                                                                                                              // 514
                                                                                                                       //
      Accounts.sendResetPasswordEmail(user._id, caseSensitiveEmail);                                                   // 516
    }                                                                                                                  // 517
                                                                                                                       //
    return forgotPassword;                                                                                             // 504
  }() });                                                                                                              // 504
                                                                                                                       //
// send the user an email with a link that when opened allows the user                                                 // 519
// to set a new password, without the old password.                                                                    // 520
                                                                                                                       //
/**                                                                                                                    // 522
 * @summary Send an email with a link the user can use to reset their password.                                        //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to send email to.                                                         //
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.sendResetPasswordEmail = function (userId, email) {                                                           // 529
  // Make sure the user exists, and email is one of their addresses.                                                   // 530
  var user = Meteor.users.findOne(userId);                                                                             // 531
  if (!user) throw new Error("Can't find user");                                                                       // 532
  // pick the first email if we weren't passed an email.                                                               // 534
  if (!email && user.emails && user.emails[0]) email = user.emails[0].address;                                         // 535
  // make sure we have a valid email                                                                                   // 537
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email)) throw new Error("No such email for user.");
                                                                                                                       //
  var token = Random.secret();                                                                                         // 541
  var when = new Date();                                                                                               // 542
  var tokenRecord = {                                                                                                  // 543
    token: token,                                                                                                      // 544
    email: email,                                                                                                      // 545
    when: when,                                                                                                        // 546
    reason: 'reset'                                                                                                    // 547
  };                                                                                                                   // 543
  Meteor.users.update(userId, { $set: {                                                                                // 549
      "services.password.reset": tokenRecord                                                                           // 550
    } });                                                                                                              // 549
  // before passing to template, update user object with new token                                                     // 552
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                                                    // 553
                                                                                                                       //
  var resetPasswordUrl = Accounts.urls.resetPassword(token);                                                           // 555
                                                                                                                       //
  var options = {                                                                                                      // 557
    to: email,                                                                                                         // 558
    from: Accounts.emailTemplates.resetPassword.from ? Accounts.emailTemplates.resetPassword.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.resetPassword.subject(user)                                                       // 562
  };                                                                                                                   // 557
                                                                                                                       //
  if (typeof Accounts.emailTemplates.resetPassword.text === 'function') {                                              // 565
    options.text = Accounts.emailTemplates.resetPassword.text(user, resetPasswordUrl);                                 // 566
  }                                                                                                                    // 568
                                                                                                                       //
  if (typeof Accounts.emailTemplates.resetPassword.html === 'function') options.html = Accounts.emailTemplates.resetPassword.html(user, resetPasswordUrl);
                                                                                                                       //
  if (_typeof(Accounts.emailTemplates.headers) === 'object') {                                                         // 574
    options.headers = Accounts.emailTemplates.headers;                                                                 // 575
  }                                                                                                                    // 576
                                                                                                                       //
  Email.send(options);                                                                                                 // 578
};                                                                                                                     // 579
                                                                                                                       //
// send the user an email informing them that their account was created, with                                          // 581
// a link that when opened both marks their email as verified and forces them                                          // 582
// to choose their password. The email must be one of the addresses in the                                             // 583
// user's emails field, or undefined to pick the first email automatically.                                            // 584
//                                                                                                                     // 585
// This is not called automatically. It must be called manually if you                                                 // 586
// want to use enrollment emails.                                                                                      // 587
                                                                                                                       //
/**                                                                                                                    // 589
 * @summary Send an email with a link the user can use to set their initial password.                                  //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to send email to.                                                         //
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.sendEnrollmentEmail = function (userId, email) {                                                              // 596
  // XXX refactor! This is basically identical to sendResetPasswordEmail.                                              // 597
                                                                                                                       //
  // Make sure the user exists, and email is in their addresses.                                                       // 599
  var user = Meteor.users.findOne(userId);                                                                             // 600
  if (!user) throw new Error("Can't find user");                                                                       // 601
  // pick the first email if we weren't passed an email.                                                               // 603
  if (!email && user.emails && user.emails[0]) email = user.emails[0].address;                                         // 604
  // make sure we have a valid email                                                                                   // 606
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email)) throw new Error("No such email for user.");
                                                                                                                       //
  var token = Random.secret();                                                                                         // 610
  var when = new Date();                                                                                               // 611
  var tokenRecord = {                                                                                                  // 612
    token: token,                                                                                                      // 613
    email: email,                                                                                                      // 614
    when: when,                                                                                                        // 615
    reason: 'enroll'                                                                                                   // 616
  };                                                                                                                   // 612
  Meteor.users.update(userId, { $set: {                                                                                // 618
      "services.password.reset": tokenRecord                                                                           // 619
    } });                                                                                                              // 618
                                                                                                                       //
  // before passing to template, update user object with new token                                                     // 622
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                                                    // 623
                                                                                                                       //
  var enrollAccountUrl = Accounts.urls.enrollAccount(token);                                                           // 625
                                                                                                                       //
  var options = {                                                                                                      // 627
    to: email,                                                                                                         // 628
    from: Accounts.emailTemplates.enrollAccount.from ? Accounts.emailTemplates.enrollAccount.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.enrollAccount.subject(user)                                                       // 632
  };                                                                                                                   // 627
                                                                                                                       //
  if (typeof Accounts.emailTemplates.enrollAccount.text === 'function') {                                              // 635
    options.text = Accounts.emailTemplates.enrollAccount.text(user, enrollAccountUrl);                                 // 636
  }                                                                                                                    // 638
                                                                                                                       //
  if (typeof Accounts.emailTemplates.enrollAccount.html === 'function') options.html = Accounts.emailTemplates.enrollAccount.html(user, enrollAccountUrl);
                                                                                                                       //
  if (_typeof(Accounts.emailTemplates.headers) === 'object') {                                                         // 644
    options.headers = Accounts.emailTemplates.headers;                                                                 // 645
  }                                                                                                                    // 646
                                                                                                                       //
  Email.send(options);                                                                                                 // 648
};                                                                                                                     // 649
                                                                                                                       //
// Take token from sendResetPasswordEmail or sendEnrollmentEmail, change                                               // 652
// the users password, and log them in.                                                                                // 653
Meteor.methods({ resetPassword: function () {                                                                          // 654
    function resetPassword(token, newPassword) {                                                                       // 654
      var self = this;                                                                                                 // 655
      return Accounts._loginMethod(self, "resetPassword", arguments, "password", function () {                         // 656
        check(token, String);                                                                                          // 662
        check(newPassword, passwordValidator);                                                                         // 663
                                                                                                                       //
        var user = Meteor.users.findOne({                                                                              // 665
          "services.password.reset.token": token });                                                                   // 666
        if (!user) throw new Meteor.Error(403, "Token expired");                                                       // 667
        var when = user.services.password.reset.when;                                                                  // 669
        var reason = user.services.password.reset.reason;                                                              // 670
        var tokenLifetimeMs = Accounts._getPasswordResetTokenLifetimeMs();                                             // 671
        if (reason === "enroll") {                                                                                     // 672
          tokenLifetimeMs = Accounts._getPasswordEnrollTokenLifetimeMs();                                              // 673
        }                                                                                                              // 674
        var currentTimeMs = Date.now();                                                                                // 675
        if (currentTimeMs - when > tokenLifetimeMs) throw new Meteor.Error(403, "Token expired");                      // 676
        var email = user.services.password.reset.email;                                                                // 678
        if (!_.include(_.pluck(user.emails || [], 'address'), email)) return {                                         // 679
          userId: user._id,                                                                                            // 681
          error: new Meteor.Error(403, "Token has invalid email address")                                              // 682
        };                                                                                                             // 680
                                                                                                                       //
        var hashed = hashPassword(newPassword);                                                                        // 685
                                                                                                                       //
        // NOTE: We're about to invalidate tokens on the user, who we might be                                         // 687
        // logged in as. Make sure to avoid logging ourselves out if this                                              // 688
        // happens. But also make sure not to leave the connection in a state                                          // 689
        // of having a bad token set if things fail.                                                                   // 690
        var oldToken = Accounts._getLoginToken(self.connection.id);                                                    // 691
        Accounts._setLoginToken(user._id, self.connection, null);                                                      // 692
        var resetToOldToken = function () {                                                                            // 693
          function resetToOldToken() {                                                                                 // 693
            Accounts._setLoginToken(user._id, self.connection, oldToken);                                              // 694
          }                                                                                                            // 695
                                                                                                                       //
          return resetToOldToken;                                                                                      // 693
        }();                                                                                                           // 693
                                                                                                                       //
        try {                                                                                                          // 697
          // Update the user record by:                                                                                // 698
          // - Changing the password to the new one                                                                    // 699
          // - Forgetting about the reset token that was just used                                                     // 700
          // - Verifying their email, since they got the password reset via email.                                     // 701
          var affectedRecords = Meteor.users.update({                                                                  // 702
            _id: user._id,                                                                                             // 704
            'emails.address': email,                                                                                   // 705
            'services.password.reset.token': token                                                                     // 706
          }, { $set: { 'services.password.bcrypt': hashed,                                                             // 703
              'emails.$.verified': true },                                                                             // 709
            $unset: { 'services.password.reset': 1,                                                                    // 710
              'services.password.srp': 1 } });                                                                         // 711
          if (affectedRecords !== 1) return {                                                                          // 712
            userId: user._id,                                                                                          // 714
            error: new Meteor.Error(403, "Invalid email")                                                              // 715
          };                                                                                                           // 713
        } catch (err) {                                                                                                // 717
          resetToOldToken();                                                                                           // 718
          throw err;                                                                                                   // 719
        }                                                                                                              // 720
                                                                                                                       //
        // Replace all valid login tokens with new ones (changing                                                      // 722
        // password should invalidate existing sessions).                                                              // 723
        Accounts._clearAllLoginTokens(user._id);                                                                       // 724
                                                                                                                       //
        return { userId: user._id };                                                                                   // 726
      });                                                                                                              // 727
    }                                                                                                                  // 729
                                                                                                                       //
    return resetPassword;                                                                                              // 654
  }() });                                                                                                              // 654
                                                                                                                       //
///                                                                                                                    // 731
/// EMAIL VERIFICATION                                                                                                 // 732
///                                                                                                                    // 733
                                                                                                                       //
                                                                                                                       //
// send the user an email with a link that when opened marks that                                                      // 736
// address as verified                                                                                                 // 737
                                                                                                                       //
/**                                                                                                                    // 739
 * @summary Send an email with a link the user can use verify their email address.                                     //
 * @locus Server                                                                                                       //
 * @param {String} userId The id of the user to send email to.                                                         //
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.sendVerificationEmail = function (userId, address) {                                                          // 746
  // XXX Also generate a link using which someone can delete this                                                      // 747
  // account if they own said address but weren't those who created                                                    // 748
  // this account.                                                                                                     // 749
                                                                                                                       //
  // Make sure the user exists, and address is one of their addresses.                                                 // 751
  var user = Meteor.users.findOne(userId);                                                                             // 752
  if (!user) throw new Error("Can't find user");                                                                       // 753
  // pick the first unverified address if we weren't passed an address.                                                // 755
  if (!address) {                                                                                                      // 756
    var email = _.find(user.emails || [], function (e) {                                                               // 757
      return !e.verified;                                                                                              // 758
    });                                                                                                                // 758
    address = (email || {}).address;                                                                                   // 759
                                                                                                                       //
    if (!address) {                                                                                                    // 761
      throw new Error("That user has no unverified email addresses.");                                                 // 762
    }                                                                                                                  // 763
  }                                                                                                                    // 764
  // make sure we have a valid address                                                                                 // 765
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address)) throw new Error("No such email address for user.");
                                                                                                                       //
  var tokenRecord = {                                                                                                  // 770
    token: Random.secret(),                                                                                            // 771
    address: address,                                                                                                  // 772
    when: new Date() };                                                                                                // 773
  Meteor.users.update({ _id: userId }, { $push: { 'services.email.verificationTokens': tokenRecord } });               // 774
                                                                                                                       //
  // before passing to template, update user object with new token                                                     // 778
  Meteor._ensure(user, 'services', 'email');                                                                           // 779
  if (!user.services.email.verificationTokens) {                                                                       // 780
    user.services.email.verificationTokens = [];                                                                       // 781
  }                                                                                                                    // 782
  user.services.email.verificationTokens.push(tokenRecord);                                                            // 783
                                                                                                                       //
  var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);                                                   // 785
                                                                                                                       //
  var options = {                                                                                                      // 787
    to: address,                                                                                                       // 788
    from: Accounts.emailTemplates.verifyEmail.from ? Accounts.emailTemplates.verifyEmail.from(user) : Accounts.emailTemplates.from,
    subject: Accounts.emailTemplates.verifyEmail.subject(user)                                                         // 792
  };                                                                                                                   // 787
                                                                                                                       //
  if (typeof Accounts.emailTemplates.verifyEmail.text === 'function') {                                                // 795
    options.text = Accounts.emailTemplates.verifyEmail.text(user, verifyEmailUrl);                                     // 796
  }                                                                                                                    // 798
                                                                                                                       //
  if (typeof Accounts.emailTemplates.verifyEmail.html === 'function') options.html = Accounts.emailTemplates.verifyEmail.html(user, verifyEmailUrl);
                                                                                                                       //
  if (_typeof(Accounts.emailTemplates.headers) === 'object') {                                                         // 804
    options.headers = Accounts.emailTemplates.headers;                                                                 // 805
  }                                                                                                                    // 806
                                                                                                                       //
  Email.send(options);                                                                                                 // 808
};                                                                                                                     // 809
                                                                                                                       //
// Take token from sendVerificationEmail, mark the email as verified,                                                  // 811
// and log them in.                                                                                                    // 812
Meteor.methods({ verifyEmail: function () {                                                                            // 813
    function verifyEmail(token) {                                                                                      // 813
      var self = this;                                                                                                 // 814
      return Accounts._loginMethod(self, "verifyEmail", arguments, "password", function () {                           // 815
        check(token, String);                                                                                          // 821
                                                                                                                       //
        var user = Meteor.users.findOne({ 'services.email.verificationTokens.token': token });                         // 823
        if (!user) throw new Meteor.Error(403, "Verify email link expired");                                           // 825
                                                                                                                       //
        var tokenRecord = _.find(user.services.email.verificationTokens, function (t) {                                // 828
          return t.token == token;                                                                                     // 830
        });                                                                                                            // 831
        if (!tokenRecord) return {                                                                                     // 832
          userId: user._id,                                                                                            // 834
          error: new Meteor.Error(403, "Verify email link expired")                                                    // 835
        };                                                                                                             // 833
                                                                                                                       //
        var emailsRecord = _.find(user.emails, function (e) {                                                          // 838
          return e.address == tokenRecord.address;                                                                     // 839
        });                                                                                                            // 840
        if (!emailsRecord) return {                                                                                    // 841
          userId: user._id,                                                                                            // 843
          error: new Meteor.Error(403, "Verify email link is for unknown address")                                     // 844
        };                                                                                                             // 842
                                                                                                                       //
        // By including the address in the query, we can use 'emails.$' in the                                         // 847
        // modifier to get a reference to the specific object in the emails                                            // 848
        // array. See                                                                                                  // 849
        // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)                            // 850
        // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull                                               // 851
        Meteor.users.update({ _id: user._id,                                                                           // 852
          'emails.address': tokenRecord.address }, { $set: { 'emails.$.verified': true },                              // 854
          $pull: { 'services.email.verificationTokens': { address: tokenRecord.address } } });                         // 856
                                                                                                                       //
        return { userId: user._id };                                                                                   // 858
      });                                                                                                              // 859
    }                                                                                                                  // 861
                                                                                                                       //
    return verifyEmail;                                                                                                // 813
  }() });                                                                                                              // 813
                                                                                                                       //
/**                                                                                                                    // 863
 * @summary Add an email address for a user. Use this instead of directly                                              //
 * updating the database. The operation will fail if there is a different user                                         //
 * with an email only differing in case. If the specified user has an existing                                         //
 * email only differing in case however, we replace it.                                                                //
 * @locus Server                                                                                                       //
 * @param {String} userId The ID of the user to update.                                                                //
 * @param {String} newEmail A new email address for the user.                                                          //
 * @param {Boolean} [verified] Optional - whether the new email address should                                         //
 * be marked as verified. Defaults to false.                                                                           //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.addEmail = function (userId, newEmail, verified) {                                                            // 875
  check(userId, NonEmptyString);                                                                                       // 876
  check(newEmail, NonEmptyString);                                                                                     // 877
  check(verified, Match.Optional(Boolean));                                                                            // 878
                                                                                                                       //
  if (_.isUndefined(verified)) {                                                                                       // 880
    verified = false;                                                                                                  // 881
  }                                                                                                                    // 882
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 884
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 885
                                                                                                                       //
  // Allow users to change their own email to a version with a different case                                          // 888
                                                                                                                       //
  // We don't have to call checkForCaseInsensitiveDuplicates to do a case                                              // 890
  // insensitive check across all emails in the database here because: (1) if                                          // 891
  // there is no case-insensitive duplicate between this user and other users,                                         // 892
  // then we are OK and (2) if this would create a conflict with other users                                           // 893
  // then there would already be a case-insensitive duplicate and we can't fix                                         // 894
  // that in this code anyway.                                                                                         // 895
  var caseInsensitiveRegExp = new RegExp('^' + Meteor._escapeRegExp(newEmail) + '$', 'i');                             // 896
                                                                                                                       //
  var didUpdateOwnEmail = _.any(user.emails, function (email, index) {                                                 // 899
    if (caseInsensitiveRegExp.test(email.address)) {                                                                   // 900
      Meteor.users.update({                                                                                            // 901
        _id: user._id,                                                                                                 // 902
        'emails.address': email.address                                                                                // 903
      }, { $set: {                                                                                                     // 901
          'emails.$.address': newEmail,                                                                                // 905
          'emails.$.verified': verified                                                                                // 906
        } });                                                                                                          // 904
      return true;                                                                                                     // 908
    }                                                                                                                  // 909
                                                                                                                       //
    return false;                                                                                                      // 911
  });                                                                                                                  // 912
                                                                                                                       //
  // In the other updates below, we have to do another call to                                                         // 914
  // checkForCaseInsensitiveDuplicates to make sure that no conflicting values                                         // 915
  // were added to the database in the meantime. We don't have to do this for                                          // 916
  // the case where the user is updating their email address to one that is the                                        // 917
  // same as before, but only different because of capitalization. Read the                                            // 918
  // big comment above to understand why.                                                                              // 919
                                                                                                                       //
  if (didUpdateOwnEmail) {                                                                                             // 921
    return;                                                                                                            // 922
  }                                                                                                                    // 923
                                                                                                                       //
  // Perform a case insensitive check for duplicates before update                                                     // 925
  checkForCaseInsensitiveDuplicates('emails.address', 'Email', newEmail, user._id);                                    // 926
                                                                                                                       //
  Meteor.users.update({                                                                                                // 928
    _id: user._id                                                                                                      // 929
  }, {                                                                                                                 // 928
    $addToSet: {                                                                                                       // 931
      emails: {                                                                                                        // 932
        address: newEmail,                                                                                             // 933
        verified: verified                                                                                             // 934
      }                                                                                                                // 932
    }                                                                                                                  // 931
  });                                                                                                                  // 930
                                                                                                                       //
  // Perform another check after update, in case a matching user has been                                              // 939
  // inserted in the meantime                                                                                          // 940
  try {                                                                                                                // 941
    checkForCaseInsensitiveDuplicates('emails.address', 'Email', newEmail, user._id);                                  // 942
  } catch (ex) {                                                                                                       // 943
    // Undo update if the check fails                                                                                  // 944
    Meteor.users.update({ _id: user._id }, { $pull: { emails: { address: newEmail } } });                              // 945
    throw ex;                                                                                                          // 947
  }                                                                                                                    // 948
};                                                                                                                     // 949
                                                                                                                       //
/**                                                                                                                    // 951
 * @summary Remove an email address for a user. Use this instead of updating                                           //
 * the database directly.                                                                                              //
 * @locus Server                                                                                                       //
 * @param {String} userId The ID of the user to update.                                                                //
 * @param {String} email The email address to remove.                                                                  //
 * @importFromPackage accounts-base                                                                                    //
 */                                                                                                                    //
Accounts.removeEmail = function (userId, email) {                                                                      // 959
  check(userId, NonEmptyString);                                                                                       // 960
  check(email, NonEmptyString);                                                                                        // 961
                                                                                                                       //
  var user = Meteor.users.findOne(userId);                                                                             // 963
  if (!user) throw new Meteor.Error(403, "User not found");                                                            // 964
                                                                                                                       //
  Meteor.users.update({ _id: user._id }, { $pull: { emails: { address: email } } });                                   // 967
};                                                                                                                     // 969
                                                                                                                       //
///                                                                                                                    // 971
/// CREATING USERS                                                                                                     // 972
///                                                                                                                    // 973
                                                                                                                       //
// Shared createUser function called from the createUser method, both                                                  // 975
// if originates in client or server code. Calls user provided hooks,                                                  // 976
// does the actual user insertion.                                                                                     // 977
//                                                                                                                     // 978
// returns the user id                                                                                                 // 979
var _createUser = function _createUser(options) {                                                                      // 980
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary                                               // 981
  // options.                                                                                                          // 982
  check(options, Match.ObjectIncluding({                                                                               // 983
    username: Match.Optional(String),                                                                                  // 984
    email: Match.Optional(String),                                                                                     // 985
    password: Match.Optional(passwordValidator)                                                                        // 986
  }));                                                                                                                 // 983
                                                                                                                       //
  var username = options.username;                                                                                     // 989
  var email = options.email;                                                                                           // 990
  if (!username && !email) throw new Meteor.Error(400, "Need to set a username or email");                             // 991
                                                                                                                       //
  var user = { services: {} };                                                                                         // 994
  if (options.password) {                                                                                              // 995
    var hashed = hashPassword(options.password);                                                                       // 996
    user.services.password = { bcrypt: hashed };                                                                       // 997
  }                                                                                                                    // 998
                                                                                                                       //
  if (username) user.username = username;                                                                              // 1000
  if (email) user.emails = [{ address: email, verified: false }];                                                      // 1002
                                                                                                                       //
  // Perform a case insensitive check before insert                                                                    // 1005
  checkForCaseInsensitiveDuplicates('username', 'Username', username);                                                 // 1006
  checkForCaseInsensitiveDuplicates('emails.address', 'Email', email);                                                 // 1007
                                                                                                                       //
  var userId = Accounts.insertUserDoc(options, user);                                                                  // 1009
  // Perform another check after insert, in case a matching user has been                                              // 1010
  // inserted in the meantime                                                                                          // 1011
  try {                                                                                                                // 1012
    checkForCaseInsensitiveDuplicates('username', 'Username', username, userId);                                       // 1013
    checkForCaseInsensitiveDuplicates('emails.address', 'Email', email, userId);                                       // 1014
  } catch (ex) {                                                                                                       // 1015
    // Remove inserted user if the check fails                                                                         // 1016
    Meteor.users.remove(userId);                                                                                       // 1017
    throw ex;                                                                                                          // 1018
  }                                                                                                                    // 1019
  return userId;                                                                                                       // 1020
};                                                                                                                     // 1021
                                                                                                                       //
// method for create user. Requests come from the client.                                                              // 1023
Meteor.methods({ createUser: function () {                                                                             // 1024
    function createUser(options) {                                                                                     // 1024
      var self = this;                                                                                                 // 1025
      return Accounts._loginMethod(self, "createUser", arguments, "password", function () {                            // 1026
        // createUser() above does more checking.                                                                      // 1032
        check(options, Object);                                                                                        // 1033
        if (Accounts._options.forbidClientAccountCreation) return {                                                    // 1034
          error: new Meteor.Error(403, "Signups forbidden")                                                            // 1036
        };                                                                                                             // 1035
                                                                                                                       //
        // Create user. result contains id and token.                                                                  // 1039
        var userId = _createUser(options);                                                                             // 1040
        // safety belt. createUser is supposed to throw on error. send 500 error                                       // 1041
        // instead of sending a verification email with empty userid.                                                  // 1042
        if (!userId) throw new Error("createUser failed to insert new user");                                          // 1043
                                                                                                                       //
        // If `Accounts._options.sendVerificationEmail` is set, register                                               // 1046
        // a token to verify the user's primary email, and send it to                                                  // 1047
        // that address.                                                                                               // 1048
        if (options.email && Accounts._options.sendVerificationEmail) Accounts.sendVerificationEmail(userId, options.email);
                                                                                                                       //
        // client gets logged in as the new user afterwards.                                                           // 1052
        return { userId: userId };                                                                                     // 1053
      });                                                                                                              // 1054
    }                                                                                                                  // 1056
                                                                                                                       //
    return createUser;                                                                                                 // 1024
  }() });                                                                                                              // 1024
                                                                                                                       //
// Create user directly on the server.                                                                                 // 1058
//                                                                                                                     // 1059
// Unlike the client version, this does not log you in as this user                                                    // 1060
// after creation.                                                                                                     // 1061
//                                                                                                                     // 1062
// returns userId or throws an error if it can't create                                                                // 1063
//                                                                                                                     // 1064
// XXX add another argument ("server options") that gets sent to onCreateUser,                                         // 1065
// which is always empty when called from the createUser method? eg, "admin:                                           // 1066
// true", which we want to prevent the client from setting, but which a custom                                         // 1067
// method calling Accounts.createUser could set?                                                                       // 1068
//                                                                                                                     // 1069
Accounts.createUser = function (options, callback) {                                                                   // 1070
  options = _.clone(options);                                                                                          // 1071
                                                                                                                       //
  // XXX allow an optional callback?                                                                                   // 1073
  if (callback) {                                                                                                      // 1074
    throw new Error("Accounts.createUser with callback not supported on the server yet.");                             // 1075
  }                                                                                                                    // 1076
                                                                                                                       //
  return _createUser(options);                                                                                         // 1078
};                                                                                                                     // 1079
                                                                                                                       //
///                                                                                                                    // 1081
/// PASSWORD-SPECIFIC INDEXES ON USERS                                                                                 // 1082
///                                                                                                                    // 1083
Meteor.users._ensureIndex('services.email.verificationTokens.token', { unique: 1, sparse: 1 });                        // 1084
Meteor.users._ensureIndex('services.password.reset.token', { unique: 1, sparse: 1 });                                  // 1086
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/accounts-password/email_templates.js");
require("./node_modules/meteor/accounts-password/password_server.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();

//# sourceMappingURL=accounts-password.js.map
