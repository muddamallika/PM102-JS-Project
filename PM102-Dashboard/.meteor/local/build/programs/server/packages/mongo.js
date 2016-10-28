(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var NpmModuleMongodb = Package['npm-mongo'].NpmModuleMongodb;
var NpmModuleMongodbVersion = Package['npm-mongo'].NpmModuleMongodbVersion;
var AllowDeny = Package['allow-deny'].AllowDeny;
var Random = Package.random.Random;
var EJSON = Package.ejson.EJSON;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var DiffSequence = Package['diff-sequence'].DiffSequence;
var MongoID = Package['mongo-id'].MongoID;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var MaxHeap = Package['binary-heap'].MaxHeap;
var MinHeap = Package['binary-heap'].MinHeap;
var MinMaxHeap = Package['binary-heap'].MinMaxHeap;
var Hook = Package['callback-hook'].Hook;
var meteorInstall = Package.modules.meteorInstall;
var Buffer = Package.modules.Buffer;
var process = Package.modules.process;
var Symbol = Package['ecmascript-runtime'].Symbol;
var Map = Package['ecmascript-runtime'].Map;
var Set = Package['ecmascript-runtime'].Set;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var MongoInternals, MongoTest, MongoConnection, mongoResult, CursorDescription, Cursor, listenAll, forEachTrigger, OPLOG_COLLECTION, idForOp, OplogHandle, ObserveMultiplexer, ObserveHandle, DocFetcher, PollingObserveDriver, OplogObserveDriver, LocalCollectionDriver, Mongo;

var require = meteorInstall({"node_modules":{"meteor":{"mongo":{"mongo_driver.js":["babel-runtime/helpers/typeof",function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/mongo_driver.js                                                                                     //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var _typeof;module.import('babel-runtime/helpers/typeof',{"default":function(v){_typeof=v}});                         //
/**                                                                                                                   // 1
 * Provide a synchronous Collection API using fibers, backed by                                                       //
 * MongoDB.  This is only for use on the server, and mostly identical                                                 //
 * to the client API.                                                                                                 //
 *                                                                                                                    //
 * NOTE: the public API methods must be run within a fiber. If you call                                               //
 * these outside of a fiber they will explode!                                                                        //
 */                                                                                                                   //
                                                                                                                      //
var path = Npm.require('path');                                                                                       // 10
var MongoDB = NpmModuleMongodb;                                                                                       // 11
var Fiber = Npm.require('fibers');                                                                                    // 12
var Future = Npm.require(path.join('fibers', 'future'));                                                              // 13
                                                                                                                      //
MongoInternals = {};                                                                                                  // 15
MongoTest = {};                                                                                                       // 16
                                                                                                                      //
MongoInternals.NpmModules = {                                                                                         // 18
  mongodb: {                                                                                                          // 19
    version: NpmModuleMongodbVersion,                                                                                 // 20
    module: MongoDB                                                                                                   // 21
  }                                                                                                                   // 19
};                                                                                                                    // 18
                                                                                                                      //
// Older version of what is now available via                                                                         // 25
// MongoInternals.NpmModules.mongodb.module.  It was never documented, but                                            // 26
// people do use it.                                                                                                  // 27
// XXX COMPAT WITH 1.0.3.2                                                                                            // 28
MongoInternals.NpmModule = MongoDB;                                                                                   // 29
                                                                                                                      //
// This is used to add or remove EJSON from the beginning of everything nested                                        // 31
// inside an EJSON custom type. It should only be called on pure JSON!                                                // 32
var replaceNames = function replaceNames(filter, thing) {                                                             // 33
  if ((typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === "object") {                                   // 34
    if (_.isArray(thing)) {                                                                                           // 35
      return _.map(thing, _.bind(replaceNames, null, filter));                                                        // 36
    }                                                                                                                 // 37
    var ret = {};                                                                                                     // 38
    _.each(thing, function (value, key) {                                                                             // 39
      ret[filter(key)] = replaceNames(filter, value);                                                                 // 40
    });                                                                                                               // 41
    return ret;                                                                                                       // 42
  }                                                                                                                   // 43
  return thing;                                                                                                       // 44
};                                                                                                                    // 45
                                                                                                                      //
// Ensure that EJSON.clone keeps a Timestamp as a Timestamp (instead of just                                          // 47
// doing a structural clone).                                                                                         // 48
// XXX how ok is this? what if there are multiple copies of MongoDB loaded?                                           // 49
MongoDB.Timestamp.prototype.clone = function () {                                                                     // 50
  // Timestamps should be immutable.                                                                                  // 51
  return this;                                                                                                        // 52
};                                                                                                                    // 53
                                                                                                                      //
var makeMongoLegal = function makeMongoLegal(name) {                                                                  // 55
  return "EJSON" + name;                                                                                              // 55
};                                                                                                                    // 55
var unmakeMongoLegal = function unmakeMongoLegal(name) {                                                              // 56
  return name.substr(5);                                                                                              // 56
};                                                                                                                    // 56
                                                                                                                      //
var replaceMongoAtomWithMeteor = function replaceMongoAtomWithMeteor(document) {                                      // 58
  if (document instanceof MongoDB.Binary) {                                                                           // 59
    var buffer = document.value(true);                                                                                // 60
    return new Uint8Array(buffer);                                                                                    // 61
  }                                                                                                                   // 62
  if (document instanceof MongoDB.ObjectID) {                                                                         // 63
    return new Mongo.ObjectID(document.toHexString());                                                                // 64
  }                                                                                                                   // 65
  if (document["EJSON$type"] && document["EJSON$value"] && _.size(document) === 2) {                                  // 66
    return EJSON.fromJSONValue(replaceNames(unmakeMongoLegal, document));                                             // 68
  }                                                                                                                   // 69
  if (document instanceof MongoDB.Timestamp) {                                                                        // 70
    // For now, the Meteor representation of a Mongo timestamp type (not a date!                                      // 71
    // this is a weird internal thing used in the oplog!) is the same as the                                          // 72
    // Mongo representation. We need to do this explicitly or else we would do a                                      // 73
    // structural clone and lose the prototype.                                                                       // 74
    return document;                                                                                                  // 75
  }                                                                                                                   // 76
  return undefined;                                                                                                   // 77
};                                                                                                                    // 78
                                                                                                                      //
var replaceMeteorAtomWithMongo = function replaceMeteorAtomWithMongo(document) {                                      // 80
  if (EJSON.isBinary(document)) {                                                                                     // 81
    // This does more copies than we'd like, but is necessary because                                                 // 82
    // MongoDB.BSON only looks like it takes a Uint8Array (and doesn't actually                                       // 83
    // serialize it correctly).                                                                                       // 84
    return new MongoDB.Binary(new Buffer(document));                                                                  // 85
  }                                                                                                                   // 86
  if (document instanceof Mongo.ObjectID) {                                                                           // 87
    return new MongoDB.ObjectID(document.toHexString());                                                              // 88
  }                                                                                                                   // 89
  if (document instanceof MongoDB.Timestamp) {                                                                        // 90
    // For now, the Meteor representation of a Mongo timestamp type (not a date!                                      // 91
    // this is a weird internal thing used in the oplog!) is the same as the                                          // 92
    // Mongo representation. We need to do this explicitly or else we would do a                                      // 93
    // structural clone and lose the prototype.                                                                       // 94
    return document;                                                                                                  // 95
  }                                                                                                                   // 96
  if (EJSON._isCustomType(document)) {                                                                                // 97
    return replaceNames(makeMongoLegal, EJSON.toJSONValue(document));                                                 // 98
  }                                                                                                                   // 99
  // It is not ordinarily possible to stick dollar-sign keys into mongo                                               // 100
  // so we don't bother checking for things that need escaping at this time.                                          // 101
  return undefined;                                                                                                   // 102
};                                                                                                                    // 103
                                                                                                                      //
var replaceTypes = function replaceTypes(document, atomTransformer) {                                                 // 105
  if ((typeof document === 'undefined' ? 'undefined' : _typeof(document)) !== 'object' || document === null) return document;
                                                                                                                      //
  var replacedTopLevelAtom = atomTransformer(document);                                                               // 109
  if (replacedTopLevelAtom !== undefined) return replacedTopLevelAtom;                                                // 110
                                                                                                                      //
  var ret = document;                                                                                                 // 113
  _.each(document, function (val, key) {                                                                              // 114
    var valReplaced = replaceTypes(val, atomTransformer);                                                             // 115
    if (val !== valReplaced) {                                                                                        // 116
      // Lazy clone. Shallow copy.                                                                                    // 117
      if (ret === document) ret = _.clone(document);                                                                  // 118
      ret[key] = valReplaced;                                                                                         // 120
    }                                                                                                                 // 121
  });                                                                                                                 // 122
  return ret;                                                                                                         // 123
};                                                                                                                    // 124
                                                                                                                      //
MongoConnection = function MongoConnection(url, options) {                                                            // 127
  var self = this;                                                                                                    // 128
  options = options || {};                                                                                            // 129
  self._observeMultiplexers = {};                                                                                     // 130
  self._onFailoverHook = new Hook();                                                                                  // 131
                                                                                                                      //
  var mongoOptions = _.extend({                                                                                       // 133
    db: { safe: true },                                                                                               // 134
    // http://mongodb.github.io/node-mongodb-native/2.2/api/Server.html                                               // 135
    server: {                                                                                                         // 136
      // Reconnect on error.                                                                                          // 137
      autoReconnect: true,                                                                                            // 138
      // Try to reconnect forever, instead of stopping after 30 tries (the                                            // 139
      // default), with each attempt separated by 1000ms.                                                             // 140
      reconnectTries: Infinity                                                                                        // 141
    },                                                                                                                // 136
    replSet: {}                                                                                                       // 143
  }, Mongo._connectionOptions);                                                                                       // 133
                                                                                                                      //
  // Disable the native parser by default, unless specifically enabled                                                // 146
  // in the mongo URL.                                                                                                // 147
  // - The native driver can cause errors which normally would be                                                     // 148
  //   thrown, caught, and handled into segfaults that take down the                                                  // 149
  //   whole app.                                                                                                     // 150
  // - Binary modules don't yet work when you bundle and move the bundle                                              // 151
  //   to a different platform (aka deploy)                                                                           // 152
  // We should revisit this after binary npm module support lands.                                                    // 153
  if (!/[\?&]native_?[pP]arser=/.test(url)) {                                                                         // 154
    mongoOptions.db.native_parser = false;                                                                            // 155
  }                                                                                                                   // 156
                                                                                                                      //
  // Internally the oplog connections specify their own poolSize                                                      // 158
  // which we don't want to overwrite with any user defined value                                                     // 159
  if (_.has(options, 'poolSize')) {                                                                                   // 160
    // If we just set this for "server", replSet will override it. If we just                                         // 161
    // set it for replSet, it will be ignored if we're not using a replSet.                                           // 162
    mongoOptions.server.poolSize = options.poolSize;                                                                  // 163
    mongoOptions.replSet.poolSize = options.poolSize;                                                                 // 164
  }                                                                                                                   // 165
                                                                                                                      //
  self.db = null;                                                                                                     // 167
  // We keep track of the ReplSet's primary, so that we can trigger hooks when                                        // 168
  // it changes.  The Node driver's joined callback seems to fire way too                                             // 169
  // often, which is why we need to track it ourselves.                                                               // 170
  self._primary = null;                                                                                               // 171
  self._oplogHandle = null;                                                                                           // 172
  self._docFetcher = null;                                                                                            // 173
                                                                                                                      //
  var connectFuture = new Future();                                                                                   // 176
  MongoDB.connect(url, mongoOptions, Meteor.bindEnvironment(function (err, db) {                                      // 177
    if (err) {                                                                                                        // 182
      throw err;                                                                                                      // 183
    }                                                                                                                 // 184
                                                                                                                      //
    // First, figure out what the current primary is, if any.                                                         // 186
    if (db.serverConfig.isMasterDoc) {                                                                                // 187
      self._primary = db.serverConfig.isMasterDoc.primary;                                                            // 188
    }                                                                                                                 // 189
                                                                                                                      //
    db.serverConfig.on('joined', Meteor.bindEnvironment(function (kind, doc) {                                        // 191
      if (kind === 'primary') {                                                                                       // 193
        if (doc.primary !== self._primary) {                                                                          // 194
          self._primary = doc.primary;                                                                                // 195
          self._onFailoverHook.each(function (callback) {                                                             // 196
            callback();                                                                                               // 197
            return true;                                                                                              // 198
          });                                                                                                         // 199
        }                                                                                                             // 200
      } else if (doc.me === self._primary) {                                                                          // 201
        // The thing we thought was primary is now something other than                                               // 202
        // primary.  Forget that we thought it was primary.  (This means                                              // 203
        // that if a server stops being primary and then starts being                                                 // 204
        // primary again without another server becoming primary in the                                               // 205
        // middle, we'll correctly count it as a failover.)                                                           // 206
        self._primary = null;                                                                                         // 207
      }                                                                                                               // 208
    }));                                                                                                              // 209
                                                                                                                      //
    // Allow the constructor to return.                                                                               // 211
    connectFuture['return'](db);                                                                                      // 212
  }, connectFuture.resolver() // onException                                                                          // 213
  ));                                                                                                                 // 180
                                                                                                                      //
  // Wait for the connection to be successful; throws on failure.                                                     // 218
  self.db = connectFuture.wait();                                                                                     // 219
                                                                                                                      //
  if (options.oplogUrl && !Package['disable-oplog']) {                                                                // 221
    self._oplogHandle = new OplogHandle(options.oplogUrl, self.db.databaseName);                                      // 222
    self._docFetcher = new DocFetcher(self);                                                                          // 223
  }                                                                                                                   // 224
};                                                                                                                    // 225
                                                                                                                      //
MongoConnection.prototype.close = function () {                                                                       // 227
  var self = this;                                                                                                    // 228
                                                                                                                      //
  if (!self.db) throw Error("close called before Connection created?");                                               // 230
                                                                                                                      //
  // XXX probably untested                                                                                            // 233
  var oplogHandle = self._oplogHandle;                                                                                // 234
  self._oplogHandle = null;                                                                                           // 235
  if (oplogHandle) oplogHandle.stop();                                                                                // 236
                                                                                                                      //
  // Use Future.wrap so that errors get thrown. This happens to                                                       // 239
  // work even outside a fiber since the 'close' method is not                                                        // 240
  // actually asynchronous.                                                                                           // 241
  Future.wrap(_.bind(self.db.close, self.db))(true).wait();                                                           // 242
};                                                                                                                    // 243
                                                                                                                      //
// Returns the Mongo Collection object; may yield.                                                                    // 245
MongoConnection.prototype.rawCollection = function (collectionName) {                                                 // 246
  var self = this;                                                                                                    // 247
                                                                                                                      //
  if (!self.db) throw Error("rawCollection called before Connection created?");                                       // 249
                                                                                                                      //
  var future = new Future();                                                                                          // 252
  self.db.collection(collectionName, future.resolver());                                                              // 253
  return future.wait();                                                                                               // 254
};                                                                                                                    // 255
                                                                                                                      //
MongoConnection.prototype._createCappedCollection = function (collectionName, byteSize, maxDocuments) {               // 257
  var self = this;                                                                                                    // 259
                                                                                                                      //
  if (!self.db) throw Error("_createCappedCollection called before Connection created?");                             // 261
                                                                                                                      //
  var future = new Future();                                                                                          // 264
  self.db.createCollection(collectionName, { capped: true, size: byteSize, max: maxDocuments }, future.resolver());   // 265
  future.wait();                                                                                                      // 269
};                                                                                                                    // 270
                                                                                                                      //
// This should be called synchronously with a write, to create a                                                      // 272
// transaction on the current write fence, if any. After we can read                                                  // 273
// the write, and after observers have been notified (or at least,                                                    // 274
// after the observer notifiers have added themselves to the write                                                    // 275
// fence), you should call 'committed()' on the object returned.                                                      // 276
MongoConnection.prototype._maybeBeginWrite = function () {                                                            // 277
  var self = this;                                                                                                    // 278
  var fence = DDPServer._CurrentWriteFence.get();                                                                     // 279
  if (fence) return fence.beginWrite();else return { committed: function () {                                         // 280
      function committed() {}                                                                                         // 283
                                                                                                                      //
      return committed;                                                                                               // 283
    }() };                                                                                                            // 283
};                                                                                                                    // 284
                                                                                                                      //
// Internal interface: adds a callback which is called when the Mongo primary                                         // 286
// changes. Returns a stop handle.                                                                                    // 287
MongoConnection.prototype._onFailover = function (callback) {                                                         // 288
  return this._onFailoverHook.register(callback);                                                                     // 289
};                                                                                                                    // 290
                                                                                                                      //
//////////// Public API //////////                                                                                    // 293
                                                                                                                      //
// The write methods block until the database has confirmed the write (it may                                         // 295
// not be replicated or stable on disk, but one server has confirmed it) if no                                        // 296
// callback is provided. If a callback is provided, then they call the callback                                       // 297
// when the write is confirmed. They return nothing on success, and raise an                                          // 298
// exception on failure.                                                                                              // 299
//                                                                                                                    // 300
// After making a write (with insert, update, remove), observers are                                                  // 301
// notified asynchronously. If you want to receive a callback once all                                                // 302
// of the observer notifications have landed for your write, do the                                                   // 303
// writes inside a write fence (set DDPServer._CurrentWriteFence to a new                                             // 304
// _WriteFence, and then set a callback on the write fence.)                                                          // 305
//                                                                                                                    // 306
// Since our execution environment is single-threaded, this is                                                        // 307
// well-defined -- a write "has been made" if it's returned, and an                                                   // 308
// observer "has been notified" if its callback has returned.                                                         // 309
                                                                                                                      //
var writeCallback = function writeCallback(write, refresh, callback) {                                                // 311
  return function (err, result) {                                                                                     // 312
    if (!err) {                                                                                                       // 313
      // XXX We don't have to run this on error, right?                                                               // 314
      try {                                                                                                           // 315
        refresh();                                                                                                    // 316
      } catch (refreshErr) {                                                                                          // 317
        if (callback) {                                                                                               // 318
          callback(refreshErr);                                                                                       // 319
          return;                                                                                                     // 320
        } else {                                                                                                      // 321
          throw refreshErr;                                                                                           // 322
        }                                                                                                             // 323
      }                                                                                                               // 324
    }                                                                                                                 // 325
    write.committed();                                                                                                // 326
    if (callback) callback(err, result);else if (err) throw err;                                                      // 327
  };                                                                                                                  // 331
};                                                                                                                    // 332
                                                                                                                      //
var bindEnvironmentForWrite = function bindEnvironmentForWrite(callback) {                                            // 334
  return Meteor.bindEnvironment(callback, "Mongo write");                                                             // 335
};                                                                                                                    // 336
                                                                                                                      //
MongoConnection.prototype._insert = function (collection_name, document, callback) {                                  // 338
  var self = this;                                                                                                    // 340
                                                                                                                      //
  var sendError = function sendError(e) {                                                                             // 342
    if (callback) return callback(e);                                                                                 // 343
    throw e;                                                                                                          // 345
  };                                                                                                                  // 346
                                                                                                                      //
  if (collection_name === "___meteor_failure_test_collection") {                                                      // 348
    var e = new Error("Failure test");                                                                                // 349
    e.expected = true;                                                                                                // 350
    sendError(e);                                                                                                     // 351
    return;                                                                                                           // 352
  }                                                                                                                   // 353
                                                                                                                      //
  if (!(LocalCollection._isPlainObject(document) && !EJSON._isCustomType(document))) {                                // 355
    sendError(new Error("Only plain objects may be inserted into MongoDB"));                                          // 357
    return;                                                                                                           // 359
  }                                                                                                                   // 360
                                                                                                                      //
  var write = self._maybeBeginWrite();                                                                                // 362
  var refresh = function refresh() {                                                                                  // 363
    Meteor.refresh({ collection: collection_name, id: document._id });                                                // 364
  };                                                                                                                  // 365
  callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));                                        // 366
  try {                                                                                                               // 367
    var collection = self.rawCollection(collection_name);                                                             // 368
    collection.insert(replaceTypes(document, replaceMeteorAtomWithMongo), { safe: true }, callback);                  // 369
  } catch (e) {                                                                                                       // 371
    write.committed();                                                                                                // 372
    throw e;                                                                                                          // 373
  }                                                                                                                   // 374
};                                                                                                                    // 375
                                                                                                                      //
// Cause queries that may be affected by the selector to poll in this write                                           // 377
// fence.                                                                                                             // 378
MongoConnection.prototype._refresh = function (collectionName, selector) {                                            // 379
  var self = this;                                                                                                    // 380
  var refreshKey = { collection: collectionName };                                                                    // 381
  // If we know which documents we're removing, don't poll queries that are                                           // 382
  // specific to other documents. (Note that multiple notifications here should                                       // 383
  // not cause multiple polls, since all our listener is doing is enqueueing a                                        // 384
  // poll.)                                                                                                           // 385
  var specificIds = LocalCollection._idsMatchedBySelector(selector);                                                  // 386
  if (specificIds) {                                                                                                  // 387
    _.each(specificIds, function (id) {                                                                               // 388
      Meteor.refresh(_.extend({ id: id }, refreshKey));                                                               // 389
    });                                                                                                               // 390
  } else {                                                                                                            // 391
    Meteor.refresh(refreshKey);                                                                                       // 392
  }                                                                                                                   // 393
};                                                                                                                    // 394
                                                                                                                      //
MongoConnection.prototype._remove = function (collection_name, selector, callback) {                                  // 396
  var self = this;                                                                                                    // 398
                                                                                                                      //
  if (collection_name === "___meteor_failure_test_collection") {                                                      // 400
    var e = new Error("Failure test");                                                                                // 401
    e.expected = true;                                                                                                // 402
    if (callback) return callback(e);else throw e;                                                                    // 403
  }                                                                                                                   // 407
                                                                                                                      //
  var write = self._maybeBeginWrite();                                                                                // 409
  var refresh = function refresh() {                                                                                  // 410
    self._refresh(collection_name, selector);                                                                         // 411
  };                                                                                                                  // 412
  callback = bindEnvironmentForWrite(writeCallback(write, refresh, callback));                                        // 413
                                                                                                                      //
  try {                                                                                                               // 415
    var collection = self.rawCollection(collection_name);                                                             // 416
    var wrappedCallback = function wrappedCallback(err, driverResult) {                                               // 417
      callback(err, transformResult(driverResult).numberAffected);                                                    // 418
    };                                                                                                                // 419
    collection.remove(replaceTypes(selector, replaceMeteorAtomWithMongo), { safe: true }, wrappedCallback);           // 420
  } catch (e) {                                                                                                       // 422
    write.committed();                                                                                                // 423
    throw e;                                                                                                          // 424
  }                                                                                                                   // 425
};                                                                                                                    // 426
                                                                                                                      //
MongoConnection.prototype._dropCollection = function (collectionName, cb) {                                           // 428
  var self = this;                                                                                                    // 429
                                                                                                                      //
  var write = self._maybeBeginWrite();                                                                                // 431
  var refresh = function refresh() {                                                                                  // 432
    Meteor.refresh({ collection: collectionName, id: null,                                                            // 433
      dropCollection: true });                                                                                        // 434
  };                                                                                                                  // 435
  cb = bindEnvironmentForWrite(writeCallback(write, refresh, cb));                                                    // 436
                                                                                                                      //
  try {                                                                                                               // 438
    var collection = self.rawCollection(collectionName);                                                              // 439
    collection.drop(cb);                                                                                              // 440
  } catch (e) {                                                                                                       // 441
    write.committed();                                                                                                // 442
    throw e;                                                                                                          // 443
  }                                                                                                                   // 444
};                                                                                                                    // 445
                                                                                                                      //
// For testing only.  Slightly better than `c.rawDatabase().dropDatabase()`                                           // 447
// because it lets the test's fence wait for it to be complete.                                                       // 448
MongoConnection.prototype._dropDatabase = function (cb) {                                                             // 449
  var self = this;                                                                                                    // 450
                                                                                                                      //
  var write = self._maybeBeginWrite();                                                                                // 452
  var refresh = function refresh() {                                                                                  // 453
    Meteor.refresh({ dropDatabase: true });                                                                           // 454
  };                                                                                                                  // 455
  cb = bindEnvironmentForWrite(writeCallback(write, refresh, cb));                                                    // 456
                                                                                                                      //
  try {                                                                                                               // 458
    self.db.dropDatabase(cb);                                                                                         // 459
  } catch (e) {                                                                                                       // 460
    write.committed();                                                                                                // 461
    throw e;                                                                                                          // 462
  }                                                                                                                   // 463
};                                                                                                                    // 464
                                                                                                                      //
MongoConnection.prototype._update = function (collection_name, selector, mod, options, callback) {                    // 466
  var self = this;                                                                                                    // 468
                                                                                                                      //
  if (!callback && options instanceof Function) {                                                                     // 470
    callback = options;                                                                                               // 471
    options = null;                                                                                                   // 472
  }                                                                                                                   // 473
                                                                                                                      //
  if (collection_name === "___meteor_failure_test_collection") {                                                      // 475
    var e = new Error("Failure test");                                                                                // 476
    e.expected = true;                                                                                                // 477
    if (callback) return callback(e);else throw e;                                                                    // 478
  }                                                                                                                   // 482
                                                                                                                      //
  // explicit safety check. null and undefined can crash the mongo                                                    // 484
  // driver. Although the node driver and minimongo do 'support'                                                      // 485
  // non-object modifier in that they don't crash, they are not                                                       // 486
  // meaningful operations and do not do anything. Defensively throw an                                               // 487
  // error here.                                                                                                      // 488
  if (!mod || (typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) !== 'object') throw new Error("Invalid modifier. Modifier must be an object.");
                                                                                                                      //
  if (!(LocalCollection._isPlainObject(mod) && !EJSON._isCustomType(mod))) {                                          // 492
    throw new Error("Only plain objects may be used as replacement" + " documents in MongoDB");                       // 494
    return;                                                                                                           // 497
  }                                                                                                                   // 498
                                                                                                                      //
  if (!options) options = {};                                                                                         // 500
                                                                                                                      //
  var write = self._maybeBeginWrite();                                                                                // 502
  var refresh = function refresh() {                                                                                  // 503
    self._refresh(collection_name, selector);                                                                         // 504
  };                                                                                                                  // 505
  callback = writeCallback(write, refresh, callback);                                                                 // 506
  try {                                                                                                               // 507
    var collection = self.rawCollection(collection_name);                                                             // 508
    var mongoOpts = { safe: true };                                                                                   // 509
    // explictly enumerate options that minimongo supports                                                            // 510
    if (options.upsert) mongoOpts.upsert = true;                                                                      // 511
    if (options.multi) mongoOpts.multi = true;                                                                        // 512
    // Lets you get a more more full result from MongoDB. Use with caution:                                           // 513
    // might not work with C.upsert (as opposed to C.update({upsert:true}) or                                         // 514
    // with simulated upsert.                                                                                         // 515
    if (options.fullResult) mongoOpts.fullResult = true;                                                              // 516
                                                                                                                      //
    var mongoSelector = replaceTypes(selector, replaceMeteorAtomWithMongo);                                           // 518
    var mongoMod = replaceTypes(mod, replaceMeteorAtomWithMongo);                                                     // 519
                                                                                                                      //
    var isModify = isModificationMod(mongoMod);                                                                       // 521
    var knownId = selector._id || mod._id;                                                                            // 522
                                                                                                                      //
    if (options._forbidReplace && !isModify) {                                                                        // 524
      var e = new Error("Invalid modifier. Replacements are forbidden.");                                             // 525
      if (callback) {                                                                                                 // 526
        return callback(e);                                                                                           // 527
      } else {                                                                                                        // 528
        throw e;                                                                                                      // 529
      }                                                                                                               // 530
    }                                                                                                                 // 531
                                                                                                                      //
    if (options.upsert && !knownId && options.insertedId) {                                                           // 533
      // XXX If we know we're using Mongo 2.6 (and this isn't a replacement)                                          // 534
      //     we should be able to just use $setOnInsert instead of this                                               // 535
      //     simulated upsert thing. (We can't use $setOnInsert with                                                  // 536
      //     replacements because there's nowhere to write it, and $setOnInsert                                       // 537
      //     can't set _id on Mongo 2.4.)                                                                             // 538
      //                                                                                                              // 539
      //     Also, in the future we could do a real upsert for the mongo id                                           // 540
      //     generation case, if the the node mongo driver gives us back the id                                       // 541
      //     of the upserted doc (which our current version does not).                                                // 542
      //                                                                                                              // 543
      //     For more context, see                                                                                    // 544
      //     https://github.com/meteor/meteor/issues/2278#issuecomment-64252706                                       // 545
      simulateUpsertWithInsertedId(collection, mongoSelector, mongoMod, isModify, options,                            // 546
      // This callback does not need to be bindEnvironment'ed because                                                 // 549
      // simulateUpsertWithInsertedId() wraps it and then passes it through                                           // 550
      // bindEnvironmentForWrite.                                                                                     // 551
      function (err, result) {                                                                                        // 552
        // If we got here via a upsert() call, then options._returnObject will                                        // 553
        // be set and we should return the whole object. Otherwise, we should                                         // 554
        // just return the number of affected docs to match the mongo API.                                            // 555
        if (result && !options._returnObject) callback(err, result.numberAffected);else callback(err, result);        // 556
      });                                                                                                             // 560
    } else {                                                                                                          // 562
      collection.update(mongoSelector, mongoMod, mongoOpts, bindEnvironmentForWrite(function (err, result) {          // 563
        if (!err) {                                                                                                   // 566
          var meteorResult = transformResult(result);                                                                 // 567
          if (meteorResult && options._returnObject) {                                                                // 568
            // If this was an upsert() call, and we ended up                                                          // 569
            // inserting a new doc and we know its id, then                                                           // 570
            // return that id as well.                                                                                // 571
                                                                                                                      //
            if (options.upsert && meteorResult.insertedId && knownId) {                                               // 573
              meteorResult.insertedId = knownId;                                                                      // 574
            }                                                                                                         // 575
            callback(err, meteorResult);                                                                              // 576
          } else {                                                                                                    // 577
            callback(err, meteorResult.numberAffected);                                                               // 578
          }                                                                                                           // 579
        } else {                                                                                                      // 580
          callback(err);                                                                                              // 581
        }                                                                                                             // 582
      }));                                                                                                            // 583
    }                                                                                                                 // 584
  } catch (e) {                                                                                                       // 585
    write.committed();                                                                                                // 586
    throw e;                                                                                                          // 587
  }                                                                                                                   // 588
};                                                                                                                    // 589
                                                                                                                      //
var isModificationMod = function isModificationMod(mod) {                                                             // 591
  var isReplace = false;                                                                                              // 592
  var isModify = false;                                                                                               // 593
  for (var k in meteorBabelHelpers.sanitizeForInObject(mod)) {                                                        // 594
    if (k.substr(0, 1) === '$') {                                                                                     // 595
      isModify = true;                                                                                                // 596
    } else {                                                                                                          // 597
      isReplace = true;                                                                                               // 598
    }                                                                                                                 // 599
  }                                                                                                                   // 600
  if (isModify && isReplace) {                                                                                        // 601
    throw new Error("Update parameter cannot have both modifier and non-modifier fields.");                           // 602
  }                                                                                                                   // 604
  return isModify;                                                                                                    // 605
};                                                                                                                    // 606
                                                                                                                      //
var transformResult = function transformResult(driverResult) {                                                        // 608
  var meteorResult = { numberAffected: 0 };                                                                           // 609
  if (driverResult) {                                                                                                 // 610
    mongoResult = driverResult.result;                                                                                // 611
                                                                                                                      //
    // On updates with upsert:true, the inserted values come as a list of                                             // 613
    // upserted values -- even with options.multi, when the upsert does insert,                                       // 614
    // it only inserts one element.                                                                                   // 615
    if (mongoResult.upserted) {                                                                                       // 616
      meteorResult.numberAffected += mongoResult.upserted.length;                                                     // 617
                                                                                                                      //
      if (mongoResult.upserted.length == 1) {                                                                         // 619
        meteorResult.insertedId = mongoResult.upserted[0]._id;                                                        // 620
      }                                                                                                               // 621
    } else {                                                                                                          // 622
      meteorResult.numberAffected = mongoResult.n;                                                                    // 623
    }                                                                                                                 // 624
  }                                                                                                                   // 625
                                                                                                                      //
  return meteorResult;                                                                                                // 627
};                                                                                                                    // 628
                                                                                                                      //
var NUM_OPTIMISTIC_TRIES = 3;                                                                                         // 631
                                                                                                                      //
// exposed for testing                                                                                                // 633
MongoConnection._isCannotChangeIdError = function (err) {                                                             // 634
  // First check for what this error looked like in Mongo 2.4.  Either of these                                       // 635
  // checks should work, but just to be safe...                                                                       // 636
  if (err.code === 13596) return true;                                                                                // 637
  if (err.errmsg.indexOf("cannot change _id of a document") === 0) return true;                                       // 639
                                                                                                                      //
  // Now look for what it looks like in Mongo 2.6.  We don't use the error code                                       // 642
  // here, because the error code we observed it producing (16837) appears to be                                      // 643
  // a far more generic error code based on examining the source.                                                     // 644
  if (err.errmsg.indexOf("The _id field cannot be changed") === 0) return true;                                       // 645
                                                                                                                      //
  return false;                                                                                                       // 648
};                                                                                                                    // 649
                                                                                                                      //
var simulateUpsertWithInsertedId = function simulateUpsertWithInsertedId(collection, selector, mod, isModify, options, callback) {
  // STRATEGY:  First try doing a plain update.  If it affected 0 documents,                                          // 653
  // then without affecting the database, we know we should probably do an                                            // 654
  // insert.  We then do a *conditional* insert that will fail in the case                                            // 655
  // of a race condition.  This conditional insert is actually an                                                     // 656
  // upsert-replace with an _id, which will never successfully update an                                              // 657
  // existing document.  If this upsert fails with an error saying it                                                 // 658
  // couldn't change an existing _id, then we know an intervening write has                                           // 659
  // caused the query to match something.  We go back to step one and repeat.                                         // 660
  // Like all "optimistic write" schemes, we rely on the fact that it's                                               // 661
  // unlikely our writes will continue to be interfered with under normal                                             // 662
  // circumstances (though sufficiently heavy contention with writers                                                 // 663
  // disagreeing on the existence of an object will cause writes to fail                                              // 664
  // in theory).                                                                                                      // 665
                                                                                                                      //
  var newDoc;                                                                                                         // 667
  // Run this code up front so that it fails fast if someone uses                                                     // 668
  // a Mongo update operator we don't support.                                                                        // 669
  if (isModify) {                                                                                                     // 670
    // We've already run replaceTypes/replaceMeteorAtomWithMongo on                                                   // 671
    // selector and mod.  We assume it doesn't matter, as far as                                                      // 672
    // the behavior of modifiers is concerned, whether `_modify`                                                      // 673
    // is run on EJSON or on mongo-converted EJSON.                                                                   // 674
    var selectorDoc = LocalCollection._removeDollarOperators(selector);                                               // 675
                                                                                                                      //
    newDoc = selectorDoc;                                                                                             // 677
                                                                                                                      //
    // Convert dotted keys into objects. (Resolves issue #4522).                                                      // 679
    _.each(newDoc, function (value, key) {                                                                            // 680
      var trail = key.split(".");                                                                                     // 681
                                                                                                                      //
      if (trail.length > 1) {                                                                                         // 683
        //Key is dotted. Convert it into an object.                                                                   // 684
        delete newDoc[key];                                                                                           // 685
                                                                                                                      //
        var obj = newDoc,                                                                                             // 687
            leaf = trail.pop();                                                                                       // 687
                                                                                                                      //
        // XXX It is not quite certain what should be done if there are clashing                                      // 690
        // keys on the trail of the dotted key. For now we will just override it                                      // 691
        // It wouldn't be a very sane query in the first place, but should look                                       // 692
        // up what mongo does in this case.                                                                           // 693
                                                                                                                      //
        while (key = trail.shift()) {                                                                                 // 695
          if (_typeof(obj[key]) !== "object") {                                                                       // 696
            obj[key] = {};                                                                                            // 697
          }                                                                                                           // 698
                                                                                                                      //
          obj = obj[key];                                                                                             // 700
        }                                                                                                             // 701
                                                                                                                      //
        obj[leaf] = value;                                                                                            // 703
      }                                                                                                               // 704
    });                                                                                                               // 705
                                                                                                                      //
    LocalCollection._modify(newDoc, mod, { isInsert: true });                                                         // 707
  } else {                                                                                                            // 708
    newDoc = mod;                                                                                                     // 709
  }                                                                                                                   // 710
                                                                                                                      //
  var insertedId = options.insertedId; // must exist                                                                  // 712
  var mongoOptsForUpdate = {                                                                                          // 713
    safe: true,                                                                                                       // 714
    multi: options.multi                                                                                              // 715
  };                                                                                                                  // 713
  var mongoOptsForInsert = {                                                                                          // 717
    safe: true,                                                                                                       // 718
    upsert: true                                                                                                      // 719
  };                                                                                                                  // 717
                                                                                                                      //
  var tries = NUM_OPTIMISTIC_TRIES;                                                                                   // 722
                                                                                                                      //
  var doUpdate = function doUpdate() {                                                                                // 724
    tries--;                                                                                                          // 725
    if (!tries) {                                                                                                     // 726
      callback(new Error("Upsert failed after " + NUM_OPTIMISTIC_TRIES + " tries."));                                 // 727
    } else {                                                                                                          // 728
      collection.update(selector, mod, mongoOptsForUpdate, bindEnvironmentForWrite(function (err, result) {           // 729
        if (err) {                                                                                                    // 731
          callback(err);                                                                                              // 732
        } else if (result && result.result.n != 0) {                                                                  // 733
          callback(null, {                                                                                            // 734
            numberAffected: result.result.n                                                                           // 735
          });                                                                                                         // 734
        } else {                                                                                                      // 737
          doConditionalInsert();                                                                                      // 738
        }                                                                                                             // 739
      }));                                                                                                            // 740
    }                                                                                                                 // 741
  };                                                                                                                  // 742
                                                                                                                      //
  var doConditionalInsert = function doConditionalInsert() {                                                          // 744
    var replacementWithId = _.extend(replaceTypes({ _id: insertedId }, replaceMeteorAtomWithMongo), newDoc);          // 745
    collection.update(selector, replacementWithId, mongoOptsForInsert, bindEnvironmentForWrite(function (err, result) {
      if (err) {                                                                                                      // 750
        // figure out if this is a                                                                                    // 751
        // "cannot change _id of document" error, and                                                                 // 752
        // if so, try doUpdate() again, up to 3 times.                                                                // 753
        if (MongoConnection._isCannotChangeIdError(err)) {                                                            // 754
          doUpdate();                                                                                                 // 755
        } else {                                                                                                      // 756
          callback(err);                                                                                              // 757
        }                                                                                                             // 758
      } else {                                                                                                        // 759
        callback(null, {                                                                                              // 760
          numberAffected: result.result.upserted.length,                                                              // 761
          insertedId: insertedId                                                                                      // 762
        });                                                                                                           // 760
      }                                                                                                               // 764
    }));                                                                                                              // 765
  };                                                                                                                  // 766
                                                                                                                      //
  doUpdate();                                                                                                         // 768
};                                                                                                                    // 769
                                                                                                                      //
_.each(["insert", "update", "remove", "dropCollection", "dropDatabase"], function (method) {                          // 771
  MongoConnection.prototype[method] = function () /* arguments */{                                                    // 772
    var self = this;                                                                                                  // 773
    return Meteor.wrapAsync(self["_" + method]).apply(self, arguments);                                               // 774
  };                                                                                                                  // 775
});                                                                                                                   // 776
                                                                                                                      //
// XXX MongoConnection.upsert() does not return the id of the inserted document                                       // 778
// unless you set it explicitly in the selector or modifier (as a replacement                                         // 779
// doc).                                                                                                              // 780
MongoConnection.prototype.upsert = function (collectionName, selector, mod, options, callback) {                      // 781
  var self = this;                                                                                                    // 783
  if (typeof options === "function" && !callback) {                                                                   // 784
    callback = options;                                                                                               // 785
    options = {};                                                                                                     // 786
  }                                                                                                                   // 787
                                                                                                                      //
  return self.update(collectionName, selector, mod, _.extend({}, options, {                                           // 789
    upsert: true,                                                                                                     // 791
    _returnObject: true                                                                                               // 792
  }), callback);                                                                                                      // 790
};                                                                                                                    // 794
                                                                                                                      //
MongoConnection.prototype.find = function (collectionName, selector, options) {                                       // 796
  var self = this;                                                                                                    // 797
                                                                                                                      //
  if (arguments.length === 1) selector = {};                                                                          // 799
                                                                                                                      //
  return new Cursor(self, new CursorDescription(collectionName, selector, options));                                  // 802
};                                                                                                                    // 804
                                                                                                                      //
MongoConnection.prototype.findOne = function (collection_name, selector, options) {                                   // 806
  var self = this;                                                                                                    // 808
  if (arguments.length === 1) selector = {};                                                                          // 809
                                                                                                                      //
  options = options || {};                                                                                            // 812
  options.limit = 1;                                                                                                  // 813
  return self.find(collection_name, selector, options).fetch()[0];                                                    // 814
};                                                                                                                    // 815
                                                                                                                      //
// We'll actually design an index API later. For now, we just pass through to                                         // 817
// Mongo's, but make it synchronous.                                                                                  // 818
MongoConnection.prototype._ensureIndex = function (collectionName, index, options) {                                  // 819
  var self = this;                                                                                                    // 821
                                                                                                                      //
  // We expect this function to be called at startup, not from within a method,                                       // 823
  // so we don't interact with the write fence.                                                                       // 824
  var collection = self.rawCollection(collectionName);                                                                // 825
  var future = new Future();                                                                                          // 826
  var indexName = collection.ensureIndex(index, options, future.resolver());                                          // 827
  future.wait();                                                                                                      // 828
};                                                                                                                    // 829
MongoConnection.prototype._dropIndex = function (collectionName, index) {                                             // 830
  var self = this;                                                                                                    // 831
                                                                                                                      //
  // This function is only used by test code, not within a method, so we don't                                        // 833
  // interact with the write fence.                                                                                   // 834
  var collection = self.rawCollection(collectionName);                                                                // 835
  var future = new Future();                                                                                          // 836
  var indexName = collection.dropIndex(index, future.resolver());                                                     // 837
  future.wait();                                                                                                      // 838
};                                                                                                                    // 839
                                                                                                                      //
// CURSORS                                                                                                            // 841
                                                                                                                      //
// There are several classes which relate to cursors:                                                                 // 843
//                                                                                                                    // 844
// CursorDescription represents the arguments used to construct a cursor:                                             // 845
// collectionName, selector, and (find) options.  Because it is used as a key                                         // 846
// for cursor de-dup, everything in it should either be JSON-stringifiable or                                         // 847
// not affect observeChanges output (eg, options.transform functions are not                                          // 848
// stringifiable but do not affect observeChanges).                                                                   // 849
//                                                                                                                    // 850
// SynchronousCursor is a wrapper around a MongoDB cursor                                                             // 851
// which includes fully-synchronous versions of forEach, etc.                                                         // 852
//                                                                                                                    // 853
// Cursor is the cursor object returned from find(), which implements the                                             // 854
// documented Mongo.Collection cursor API.  It wraps a CursorDescription and a                                        // 855
// SynchronousCursor (lazily: it doesn't contact Mongo until you call a method                                        // 856
// like fetch or forEach on it).                                                                                      // 857
//                                                                                                                    // 858
// ObserveHandle is the "observe handle" returned from observeChanges. It has a                                       // 859
// reference to an ObserveMultiplexer.                                                                                // 860
//                                                                                                                    // 861
// ObserveMultiplexer allows multiple identical ObserveHandles to be driven by a                                      // 862
// single observe driver.                                                                                             // 863
//                                                                                                                    // 864
// There are two "observe drivers" which drive ObserveMultiplexers:                                                   // 865
//   - PollingObserveDriver caches the results of a query and reruns it when                                          // 866
//     necessary.                                                                                                     // 867
//   - OplogObserveDriver follows the Mongo operation log to directly observe                                         // 868
//     database changes.                                                                                              // 869
// Both implementations follow the same simple interface: when you create them,                                       // 870
// they start sending observeChanges callbacks (and a ready() invocation) to                                          // 871
// their ObserveMultiplexer, and you stop them by calling their stop() method.                                        // 872
                                                                                                                      //
CursorDescription = function CursorDescription(collectionName, selector, options) {                                   // 874
  var self = this;                                                                                                    // 875
  self.collectionName = collectionName;                                                                               // 876
  self.selector = Mongo.Collection._rewriteSelector(selector);                                                        // 877
  self.options = options || {};                                                                                       // 878
};                                                                                                                    // 879
                                                                                                                      //
Cursor = function Cursor(mongo, cursorDescription) {                                                                  // 881
  var self = this;                                                                                                    // 882
                                                                                                                      //
  self._mongo = mongo;                                                                                                // 884
  self._cursorDescription = cursorDescription;                                                                        // 885
  self._synchronousCursor = null;                                                                                     // 886
};                                                                                                                    // 887
                                                                                                                      //
_.each(['forEach', 'map', 'fetch', 'count'], function (method) {                                                      // 889
  Cursor.prototype[method] = function () {                                                                            // 890
    var self = this;                                                                                                  // 891
                                                                                                                      //
    // You can only observe a tailable cursor.                                                                        // 893
    if (self._cursorDescription.options.tailable) throw new Error("Cannot call " + method + " on a tailable cursor");
                                                                                                                      //
    if (!self._synchronousCursor) {                                                                                   // 897
      self._synchronousCursor = self._mongo._createSynchronousCursor(self._cursorDescription, {                       // 898
        // Make sure that the "self" argument to forEach/map callbacks is the                                         // 900
        // Cursor, not the SynchronousCursor.                                                                         // 901
        selfForIteration: self,                                                                                       // 902
        useTransform: true                                                                                            // 903
      });                                                                                                             // 899
    }                                                                                                                 // 905
                                                                                                                      //
    return self._synchronousCursor[method].apply(self._synchronousCursor, arguments);                                 // 907
  };                                                                                                                  // 909
});                                                                                                                   // 910
                                                                                                                      //
// Since we don't actually have a "nextObject" interface, there's really no                                           // 912
// reason to have a "rewind" interface.  All it did was make multiple calls                                           // 913
// to fetch/map/forEach return nothing the second time.                                                               // 914
// XXX COMPAT WITH 0.8.1                                                                                              // 915
Cursor.prototype.rewind = function () {};                                                                             // 916
                                                                                                                      //
Cursor.prototype.getTransform = function () {                                                                         // 919
  return this._cursorDescription.options.transform;                                                                   // 920
};                                                                                                                    // 921
                                                                                                                      //
// When you call Meteor.publish() with a function that returns a Cursor, we need                                      // 923
// to transmute it into the equivalent subscription.  This is the function that                                       // 924
// does that.                                                                                                         // 925
                                                                                                                      //
Cursor.prototype._publishCursor = function (sub) {                                                                    // 927
  var self = this;                                                                                                    // 928
  var collection = self._cursorDescription.collectionName;                                                            // 929
  return Mongo.Collection._publishCursor(self, sub, collection);                                                      // 930
};                                                                                                                    // 931
                                                                                                                      //
// Used to guarantee that publish functions return at most one cursor per                                             // 933
// collection. Private, because we might later have cursors that include                                              // 934
// documents from multiple collections somehow.                                                                       // 935
Cursor.prototype._getCollectionName = function () {                                                                   // 936
  var self = this;                                                                                                    // 937
  return self._cursorDescription.collectionName;                                                                      // 938
};                                                                                                                    // 939
                                                                                                                      //
Cursor.prototype.observe = function (callbacks) {                                                                     // 941
  var self = this;                                                                                                    // 942
  return LocalCollection._observeFromObserveChanges(self, callbacks);                                                 // 943
};                                                                                                                    // 944
                                                                                                                      //
Cursor.prototype.observeChanges = function (callbacks) {                                                              // 946
  var self = this;                                                                                                    // 947
  var ordered = LocalCollection._observeChangesCallbacksAreOrdered(callbacks);                                        // 948
  return self._mongo._observeChanges(self._cursorDescription, ordered, callbacks);                                    // 949
};                                                                                                                    // 951
                                                                                                                      //
MongoConnection.prototype._createSynchronousCursor = function (cursorDescription, options) {                          // 953
  var self = this;                                                                                                    // 955
  options = _.pick(options || {}, 'selfForIteration', 'useTransform');                                                // 956
                                                                                                                      //
  var collection = self.rawCollection(cursorDescription.collectionName);                                              // 958
  var cursorOptions = cursorDescription.options;                                                                      // 959
  var mongoOptions = {                                                                                                // 960
    sort: cursorOptions.sort,                                                                                         // 961
    limit: cursorOptions.limit,                                                                                       // 962
    skip: cursorOptions.skip                                                                                          // 963
  };                                                                                                                  // 960
                                                                                                                      //
  // Do we want a tailable cursor (which only works on capped collections)?                                           // 966
  if (cursorOptions.tailable) {                                                                                       // 967
    // We want a tailable cursor...                                                                                   // 968
    mongoOptions.tailable = true;                                                                                     // 969
    // ... and for the server to wait a bit if any getMore has no data (rather                                        // 970
    // than making us put the relevant sleeps in the client)...                                                       // 971
    mongoOptions.awaitdata = true;                                                                                    // 972
    // ... and to keep querying the server indefinitely rather than just 5 times                                      // 973
    // if there's no more data.                                                                                       // 974
    mongoOptions.numberOfRetries = -1;                                                                                // 975
    // And if this is on the oplog collection and the cursor specifies a 'ts',                                        // 976
    // then set the undocumented oplog replay flag, which does a special scan to                                      // 977
    // find the first document (instead of creating an index on ts). This is a                                        // 978
    // very hard-coded Mongo flag which only works on the oplog collection and                                        // 979
    // only works with the ts field.                                                                                  // 980
    if (cursorDescription.collectionName === OPLOG_COLLECTION && cursorDescription.selector.ts) {                     // 981
      mongoOptions.oplogReplay = true;                                                                                // 983
    }                                                                                                                 // 984
  }                                                                                                                   // 985
                                                                                                                      //
  var dbCursor = collection.find(replaceTypes(cursorDescription.selector, replaceMeteorAtomWithMongo), cursorOptions.fields, mongoOptions);
                                                                                                                      //
  return new SynchronousCursor(dbCursor, cursorDescription, options);                                                 // 991
};                                                                                                                    // 992
                                                                                                                      //
var SynchronousCursor = function SynchronousCursor(dbCursor, cursorDescription, options) {                            // 994
  var self = this;                                                                                                    // 995
  options = _.pick(options || {}, 'selfForIteration', 'useTransform');                                                // 996
                                                                                                                      //
  self._dbCursor = dbCursor;                                                                                          // 998
  self._cursorDescription = cursorDescription;                                                                        // 999
  // The "self" argument passed to forEach/map callbacks. If we're wrapped                                            // 1000
  // inside a user-visible Cursor, we want to provide the outer cursor!                                               // 1001
  self._selfForIteration = options.selfForIteration || self;                                                          // 1002
  if (options.useTransform && cursorDescription.options.transform) {                                                  // 1003
    self._transform = LocalCollection.wrapTransform(cursorDescription.options.transform);                             // 1004
  } else {                                                                                                            // 1006
    self._transform = null;                                                                                           // 1007
  }                                                                                                                   // 1008
                                                                                                                      //
  // Need to specify that the callback is the first argument to nextObject,                                           // 1010
  // since otherwise when we try to call it with no args the driver will                                              // 1011
  // interpret "undefined" first arg as an options hash and crash.                                                    // 1012
  self._synchronousNextObject = Future.wrap(dbCursor.nextObject.bind(dbCursor), 0);                                   // 1013
  self._synchronousCount = Future.wrap(dbCursor.count.bind(dbCursor));                                                // 1015
  self._visitedIds = new LocalCollection._IdMap();                                                                    // 1016
};                                                                                                                    // 1017
                                                                                                                      //
_.extend(SynchronousCursor.prototype, {                                                                               // 1019
  _nextObject: function () {                                                                                          // 1020
    function _nextObject() {                                                                                          // 1020
      var self = this;                                                                                                // 1021
                                                                                                                      //
      while (true) {                                                                                                  // 1023
        var doc = self._synchronousNextObject().wait();                                                               // 1024
                                                                                                                      //
        if (!doc) return null;                                                                                        // 1026
        doc = replaceTypes(doc, replaceMongoAtomWithMeteor);                                                          // 1027
                                                                                                                      //
        if (!self._cursorDescription.options.tailable && _.has(doc, '_id')) {                                         // 1029
          // Did Mongo give us duplicate documents in the same cursor? If so,                                         // 1030
          // ignore this one. (Do this before the transform, since transform might                                    // 1031
          // return some unrelated value.) We don't do this for tailable cursors,                                     // 1032
          // because we want to maintain O(1) memory usage. And if there isn't _id                                    // 1033
          // for some reason (maybe it's the oplog), then we don't do this either.                                    // 1034
          // (Be careful to do this for falsey but existing _id, though.)                                             // 1035
          if (self._visitedIds.has(doc._id)) continue;                                                                // 1036
          self._visitedIds.set(doc._id, true);                                                                        // 1037
        }                                                                                                             // 1038
                                                                                                                      //
        if (self._transform) doc = self._transform(doc);                                                              // 1040
                                                                                                                      //
        return doc;                                                                                                   // 1043
      }                                                                                                               // 1044
    }                                                                                                                 // 1045
                                                                                                                      //
    return _nextObject;                                                                                               // 1020
  }(),                                                                                                                // 1020
                                                                                                                      //
  forEach: function () {                                                                                              // 1047
    function forEach(callback, thisArg) {                                                                             // 1047
      var self = this;                                                                                                // 1048
                                                                                                                      //
      // Get back to the beginning.                                                                                   // 1050
      self._rewind();                                                                                                 // 1051
                                                                                                                      //
      // We implement the loop ourself instead of using self._dbCursor.each,                                          // 1053
      // because "each" will call its callback outside of a fiber which makes it                                      // 1054
      // much more complex to make this function synchronous.                                                         // 1055
      var index = 0;                                                                                                  // 1056
      while (true) {                                                                                                  // 1057
        var doc = self._nextObject();                                                                                 // 1058
        if (!doc) return;                                                                                             // 1059
        callback.call(thisArg, doc, index++, self._selfForIteration);                                                 // 1060
      }                                                                                                               // 1061
    }                                                                                                                 // 1062
                                                                                                                      //
    return forEach;                                                                                                   // 1047
  }(),                                                                                                                // 1047
                                                                                                                      //
  // XXX Allow overlapping callback executions if callback yields.                                                    // 1064
  map: function () {                                                                                                  // 1065
    function map(callback, thisArg) {                                                                                 // 1065
      var self = this;                                                                                                // 1066
      var res = [];                                                                                                   // 1067
      self.forEach(function (doc, index) {                                                                            // 1068
        res.push(callback.call(thisArg, doc, index, self._selfForIteration));                                         // 1069
      });                                                                                                             // 1070
      return res;                                                                                                     // 1071
    }                                                                                                                 // 1072
                                                                                                                      //
    return map;                                                                                                       // 1065
  }(),                                                                                                                // 1065
                                                                                                                      //
  _rewind: function () {                                                                                              // 1074
    function _rewind() {                                                                                              // 1074
      var self = this;                                                                                                // 1075
                                                                                                                      //
      // known to be synchronous                                                                                      // 1077
      self._dbCursor.rewind();                                                                                        // 1078
                                                                                                                      //
      self._visitedIds = new LocalCollection._IdMap();                                                                // 1080
    }                                                                                                                 // 1081
                                                                                                                      //
    return _rewind;                                                                                                   // 1074
  }(),                                                                                                                // 1074
                                                                                                                      //
  // Mostly usable for tailable cursors.                                                                              // 1083
  close: function () {                                                                                                // 1084
    function close() {                                                                                                // 1084
      var self = this;                                                                                                // 1085
                                                                                                                      //
      self._dbCursor.close();                                                                                         // 1087
    }                                                                                                                 // 1088
                                                                                                                      //
    return close;                                                                                                     // 1084
  }(),                                                                                                                // 1084
                                                                                                                      //
  fetch: function () {                                                                                                // 1090
    function fetch() {                                                                                                // 1090
      var self = this;                                                                                                // 1091
      return self.map(_.identity);                                                                                    // 1092
    }                                                                                                                 // 1093
                                                                                                                      //
    return fetch;                                                                                                     // 1090
  }(),                                                                                                                // 1090
                                                                                                                      //
  count: function () {                                                                                                // 1095
    function count(applySkipLimit) {                                                                                  // 1095
      var self = this;                                                                                                // 1096
      return self._synchronousCount(applySkipLimit).wait();                                                           // 1097
    }                                                                                                                 // 1098
                                                                                                                      //
    return count;                                                                                                     // 1095
  }(),                                                                                                                // 1095
                                                                                                                      //
  // This method is NOT wrapped in Cursor.                                                                            // 1100
  getRawObjects: function () {                                                                                        // 1101
    function getRawObjects(ordered) {                                                                                 // 1101
      var self = this;                                                                                                // 1102
      if (ordered) {                                                                                                  // 1103
        return self.fetch();                                                                                          // 1104
      } else {                                                                                                        // 1105
        var results = new LocalCollection._IdMap();                                                                   // 1106
        self.forEach(function (doc) {                                                                                 // 1107
          results.set(doc._id, doc);                                                                                  // 1108
        });                                                                                                           // 1109
        return results;                                                                                               // 1110
      }                                                                                                               // 1111
    }                                                                                                                 // 1112
                                                                                                                      //
    return getRawObjects;                                                                                             // 1101
  }()                                                                                                                 // 1101
});                                                                                                                   // 1019
                                                                                                                      //
MongoConnection.prototype.tail = function (cursorDescription, docCallback) {                                          // 1115
  var self = this;                                                                                                    // 1116
  if (!cursorDescription.options.tailable) throw new Error("Can only tail a tailable cursor");                        // 1117
                                                                                                                      //
  var cursor = self._createSynchronousCursor(cursorDescription);                                                      // 1120
                                                                                                                      //
  var stopped = false;                                                                                                // 1122
  var lastTS = undefined;                                                                                             // 1123
  var loop = function loop() {                                                                                        // 1124
    while (true) {                                                                                                    // 1125
      if (stopped) return;                                                                                            // 1126
      try {                                                                                                           // 1128
        var doc = cursor._nextObject();                                                                               // 1129
      } catch (err) {                                                                                                 // 1130
        // There's no good way to figure out if this was actually an error                                            // 1131
        // from Mongo. Ah well. But either way, we need to retry the cursor                                           // 1132
        // (unless the failure was because the observe got stopped).                                                  // 1133
        doc = null;                                                                                                   // 1134
      }                                                                                                               // 1135
      // Since cursor._nextObject can yield, we need to check again to see if                                         // 1136
      // we've been stopped before calling the callback.                                                              // 1137
      if (stopped) return;                                                                                            // 1138
      if (doc) {                                                                                                      // 1140
        // If a tailable cursor contains a "ts" field, use it to recreate the                                         // 1141
        // cursor on error. ("ts" is a standard that Mongo uses internally for                                        // 1142
        // the oplog, and there's a special flag that lets you do binary search                                       // 1143
        // on it instead of needing to use an index.)                                                                 // 1144
        lastTS = doc.ts;                                                                                              // 1145
        docCallback(doc);                                                                                             // 1146
      } else {                                                                                                        // 1147
        var newSelector = _.clone(cursorDescription.selector);                                                        // 1148
        if (lastTS) {                                                                                                 // 1149
          newSelector.ts = { $gt: lastTS };                                                                           // 1150
        }                                                                                                             // 1151
        cursor = self._createSynchronousCursor(new CursorDescription(cursorDescription.collectionName, newSelector, cursorDescription.options));
        // Mongo failover takes many seconds.  Retry in a bit.  (Without this                                         // 1156
        // setTimeout, we peg the CPU at 100% and never notice the actual                                             // 1157
        // failover.                                                                                                  // 1158
        Meteor.setTimeout(loop, 100);                                                                                 // 1159
        break;                                                                                                        // 1160
      }                                                                                                               // 1161
    }                                                                                                                 // 1162
  };                                                                                                                  // 1163
                                                                                                                      //
  Meteor.defer(loop);                                                                                                 // 1165
                                                                                                                      //
  return {                                                                                                            // 1167
    stop: function () {                                                                                               // 1168
      function stop() {                                                                                               // 1168
        stopped = true;                                                                                               // 1169
        cursor.close();                                                                                               // 1170
      }                                                                                                               // 1171
                                                                                                                      //
      return stop;                                                                                                    // 1168
    }()                                                                                                               // 1168
  };                                                                                                                  // 1167
};                                                                                                                    // 1173
                                                                                                                      //
MongoConnection.prototype._observeChanges = function (cursorDescription, ordered, callbacks) {                        // 1175
  var self = this;                                                                                                    // 1177
                                                                                                                      //
  if (cursorDescription.options.tailable) {                                                                           // 1179
    return self._observeChangesTailable(cursorDescription, ordered, callbacks);                                       // 1180
  }                                                                                                                   // 1181
                                                                                                                      //
  // You may not filter out _id when observing changes, because the id is a core                                      // 1183
  // part of the observeChanges API.                                                                                  // 1184
  if (cursorDescription.options.fields && (cursorDescription.options.fields._id === 0 || cursorDescription.options.fields._id === false)) {
    throw Error("You may not observe a cursor with {fields: {_id: 0}}");                                              // 1188
  }                                                                                                                   // 1189
                                                                                                                      //
  var observeKey = JSON.stringify(_.extend({ ordered: ordered }, cursorDescription));                                 // 1191
                                                                                                                      //
  var multiplexer, observeDriver;                                                                                     // 1194
  var firstHandle = false;                                                                                            // 1195
                                                                                                                      //
  // Find a matching ObserveMultiplexer, or create a new one. This next block is                                      // 1197
  // guaranteed to not yield (and it doesn't call anything that can observe a                                         // 1198
  // new query), so no other calls to this function can interleave with it.                                           // 1199
  Meteor._noYieldsAllowed(function () {                                                                               // 1200
    if (_.has(self._observeMultiplexers, observeKey)) {                                                               // 1201
      multiplexer = self._observeMultiplexers[observeKey];                                                            // 1202
    } else {                                                                                                          // 1203
      firstHandle = true;                                                                                             // 1204
      // Create a new ObserveMultiplexer.                                                                             // 1205
      multiplexer = new ObserveMultiplexer({                                                                          // 1206
        ordered: ordered,                                                                                             // 1207
        onStop: function () {                                                                                         // 1208
          function onStop() {                                                                                         // 1208
            delete self._observeMultiplexers[observeKey];                                                             // 1209
            observeDriver.stop();                                                                                     // 1210
          }                                                                                                           // 1211
                                                                                                                      //
          return onStop;                                                                                              // 1208
        }()                                                                                                           // 1208
      });                                                                                                             // 1206
      self._observeMultiplexers[observeKey] = multiplexer;                                                            // 1213
    }                                                                                                                 // 1214
  });                                                                                                                 // 1215
                                                                                                                      //
  var observeHandle = new ObserveHandle(multiplexer, callbacks);                                                      // 1217
                                                                                                                      //
  if (firstHandle) {                                                                                                  // 1219
    var matcher, sorter;                                                                                              // 1220
    var canUseOplog = _.all([function () {                                                                            // 1221
      // At a bare minimum, using the oplog requires us to have an oplog, to                                          // 1223
      // want unordered callbacks, and to not want a callback on the polls                                            // 1224
      // that won't happen.                                                                                           // 1225
      return self._oplogHandle && !ordered && !callbacks._testOnlyPollCallback;                                       // 1226
    }, function () {                                                                                                  // 1228
      // We need to be able to compile the selector. Fall back to polling for                                         // 1229
      // some newfangled $selector that minimongo doesn't support yet.                                                // 1230
      try {                                                                                                           // 1231
        matcher = new Minimongo.Matcher(cursorDescription.selector);                                                  // 1232
        return true;                                                                                                  // 1233
      } catch (e) {                                                                                                   // 1234
        // XXX make all compilation errors MinimongoError or something                                                // 1235
        //     so that this doesn't ignore unrelated exceptions                                                       // 1236
        return false;                                                                                                 // 1237
      }                                                                                                               // 1238
    }, function () {                                                                                                  // 1239
      // ... and the selector itself needs to support oplog.                                                          // 1240
      return OplogObserveDriver.cursorSupported(cursorDescription, matcher);                                          // 1241
    }, function () {                                                                                                  // 1242
      // And we need to be able to compile the sort, if any.  eg, can't be                                            // 1243
      // {$natural: 1}.                                                                                               // 1244
      if (!cursorDescription.options.sort) return true;                                                               // 1245
      try {                                                                                                           // 1247
        sorter = new Minimongo.Sorter(cursorDescription.options.sort, { matcher: matcher });                          // 1248
        return true;                                                                                                  // 1250
      } catch (e) {                                                                                                   // 1251
        // XXX make all compilation errors MinimongoError or something                                                // 1252
        //     so that this doesn't ignore unrelated exceptions                                                       // 1253
        return false;                                                                                                 // 1254
      }                                                                                                               // 1255
    }], function (f) {                                                                                                // 1256
      return f();                                                                                                     // 1256
    }); // invoke each function                                                                                       // 1256
                                                                                                                      //
    var driverClass = canUseOplog ? OplogObserveDriver : PollingObserveDriver;                                        // 1258
    observeDriver = new driverClass({                                                                                 // 1259
      cursorDescription: cursorDescription,                                                                           // 1260
      mongoHandle: self,                                                                                              // 1261
      multiplexer: multiplexer,                                                                                       // 1262
      ordered: ordered,                                                                                               // 1263
      matcher: matcher, // ignored by polling                                                                         // 1264
      sorter: sorter, // ignored by polling                                                                           // 1265
      _testOnlyPollCallback: callbacks._testOnlyPollCallback                                                          // 1266
    });                                                                                                               // 1259
                                                                                                                      //
    // This field is only set for use in tests.                                                                       // 1269
    multiplexer._observeDriver = observeDriver;                                                                       // 1270
  }                                                                                                                   // 1271
                                                                                                                      //
  // Blocks until the initial adds have been sent.                                                                    // 1273
  multiplexer.addHandleAndSendInitialAdds(observeHandle);                                                             // 1274
                                                                                                                      //
  return observeHandle;                                                                                               // 1276
};                                                                                                                    // 1277
                                                                                                                      //
// Listen for the invalidation messages that will trigger us to poll the                                              // 1279
// database for changes. If this selector specifies specific IDs, specify them                                        // 1280
// here, so that updates to different specific IDs don't cause us to poll.                                            // 1281
// listenCallback is the same kind of (notification, complete) callback passed                                        // 1282
// to InvalidationCrossbar.listen.                                                                                    // 1283
                                                                                                                      //
listenAll = function listenAll(cursorDescription, listenCallback) {                                                   // 1285
  var listeners = [];                                                                                                 // 1286
  forEachTrigger(cursorDescription, function (trigger) {                                                              // 1287
    listeners.push(DDPServer._InvalidationCrossbar.listen(trigger, listenCallback));                                  // 1288
  });                                                                                                                 // 1290
                                                                                                                      //
  return {                                                                                                            // 1292
    stop: function () {                                                                                               // 1293
      function stop() {                                                                                               // 1293
        _.each(listeners, function (listener) {                                                                       // 1294
          listener.stop();                                                                                            // 1295
        });                                                                                                           // 1296
      }                                                                                                               // 1297
                                                                                                                      //
      return stop;                                                                                                    // 1293
    }()                                                                                                               // 1293
  };                                                                                                                  // 1292
};                                                                                                                    // 1299
                                                                                                                      //
forEachTrigger = function forEachTrigger(cursorDescription, triggerCallback) {                                        // 1301
  var key = { collection: cursorDescription.collectionName };                                                         // 1302
  var specificIds = LocalCollection._idsMatchedBySelector(cursorDescription.selector);                                // 1303
  if (specificIds) {                                                                                                  // 1305
    _.each(specificIds, function (id) {                                                                               // 1306
      triggerCallback(_.extend({ id: id }, key));                                                                     // 1307
    });                                                                                                               // 1308
    triggerCallback(_.extend({ dropCollection: true, id: null }, key));                                               // 1309
  } else {                                                                                                            // 1310
    triggerCallback(key);                                                                                             // 1311
  }                                                                                                                   // 1312
  // Everyone cares about the database being dropped.                                                                 // 1313
  triggerCallback({ dropDatabase: true });                                                                            // 1314
};                                                                                                                    // 1315
                                                                                                                      //
// observeChanges for tailable cursors on capped collections.                                                         // 1317
//                                                                                                                    // 1318
// Some differences from normal cursors:                                                                              // 1319
//   - Will never produce anything other than 'added' or 'addedBefore'. If you                                        // 1320
//     do update a document that has already been produced, this will not notice                                      // 1321
//     it.                                                                                                            // 1322
//   - If you disconnect and reconnect from Mongo, it will essentially restart                                        // 1323
//     the query, which will lead to duplicate results. This is pretty bad,                                           // 1324
//     but if you include a field called 'ts' which is inserted as                                                    // 1325
//     new MongoInternals.MongoTimestamp(0, 0) (which is initialized to the                                           // 1326
//     current Mongo-style timestamp), we'll be able to find the place to                                             // 1327
//     restart properly. (This field is specifically understood by Mongo with an                                      // 1328
//     optimization which allows it to find the right place to start without                                          // 1329
//     an index on ts. It's how the oplog works.)                                                                     // 1330
//   - No callbacks are triggered synchronously with the call (there's no                                             // 1331
//     differentiation between "initial data" and "later changes"; everything                                         // 1332
//     that matches the query gets sent asynchronously).                                                              // 1333
//   - De-duplication is not implemented.                                                                             // 1334
//   - Does not yet interact with the write fence. Probably, this should work by                                      // 1335
//     ignoring removes (which don't work on capped collections) and updates                                          // 1336
//     (which don't affect tailable cursors), and just keeping track of the ID                                        // 1337
//     of the inserted object, and closing the write fence once you get to that                                       // 1338
//     ID (or timestamp?).  This doesn't work well if the document doesn't match                                      // 1339
//     the query, though.  On the other hand, the write fence can close                                               // 1340
//     immediately if it does not match the query. So if we trust minimongo                                           // 1341
//     enough to accurately evaluate the query against the write fence, we                                            // 1342
//     should be able to do this...  Of course, minimongo doesn't even support                                        // 1343
//     Mongo Timestamps yet.                                                                                          // 1344
MongoConnection.prototype._observeChangesTailable = function (cursorDescription, ordered, callbacks) {                // 1345
  var self = this;                                                                                                    // 1347
                                                                                                                      //
  // Tailable cursors only ever call added/addedBefore callbacks, so it's an                                          // 1349
  // error if you didn't provide them.                                                                                // 1350
  if (ordered && !callbacks.addedBefore || !ordered && !callbacks.added) {                                            // 1351
    throw new Error("Can't observe an " + (ordered ? "ordered" : "unordered") + " tailable cursor without a " + (ordered ? "addedBefore" : "added") + " callback");
  }                                                                                                                   // 1356
                                                                                                                      //
  return self.tail(cursorDescription, function (doc) {                                                                // 1358
    var id = doc._id;                                                                                                 // 1359
    delete doc._id;                                                                                                   // 1360
    // The ts is an implementation detail. Hide it.                                                                   // 1361
    delete doc.ts;                                                                                                    // 1362
    if (ordered) {                                                                                                    // 1363
      callbacks.addedBefore(id, doc, null);                                                                           // 1364
    } else {                                                                                                          // 1365
      callbacks.added(id, doc);                                                                                       // 1366
    }                                                                                                                 // 1367
  });                                                                                                                 // 1368
};                                                                                                                    // 1369
                                                                                                                      //
// XXX We probably need to find a better way to expose this. Right now                                                // 1371
// it's only used by tests, but in fact you need it in normal                                                         // 1372
// operation to interact with capped collections.                                                                     // 1373
MongoInternals.MongoTimestamp = MongoDB.Timestamp;                                                                    // 1374
                                                                                                                      //
MongoInternals.Connection = MongoConnection;                                                                          // 1376
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"oplog_tailing.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/oplog_tailing.js                                                                                    //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Future = Npm.require('fibers/future');                                                                            // 1
                                                                                                                      //
OPLOG_COLLECTION = 'oplog.rs';                                                                                        // 3
                                                                                                                      //
var TOO_FAR_BEHIND = process.env.METEOR_OPLOG_TOO_FAR_BEHIND || 2000;                                                 // 5
                                                                                                                      //
var showTS = function showTS(ts) {                                                                                    // 7
  return "Timestamp(" + ts.getHighBits() + ", " + ts.getLowBits() + ")";                                              // 8
};                                                                                                                    // 9
                                                                                                                      //
idForOp = function idForOp(op) {                                                                                      // 11
  if (op.op === 'd') return op.o._id;else if (op.op === 'i') return op.o._id;else if (op.op === 'u') return op.o2._id;else if (op.op === 'c') throw Error("Operator 'c' doesn't supply an object with id: " + EJSON.stringify(op));else throw Error("Unknown op: " + EJSON.stringify(op));
};                                                                                                                    // 23
                                                                                                                      //
OplogHandle = function OplogHandle(oplogUrl, dbName) {                                                                // 25
  var self = this;                                                                                                    // 26
  self._oplogUrl = oplogUrl;                                                                                          // 27
  self._dbName = dbName;                                                                                              // 28
                                                                                                                      //
  self._oplogLastEntryConnection = null;                                                                              // 30
  self._oplogTailConnection = null;                                                                                   // 31
  self._stopped = false;                                                                                              // 32
  self._tailHandle = null;                                                                                            // 33
  self._readyFuture = new Future();                                                                                   // 34
  self._crossbar = new DDPServer._Crossbar({                                                                          // 35
    factPackage: "mongo-livedata", factName: "oplog-watchers"                                                         // 36
  });                                                                                                                 // 35
  self._baseOplogSelector = {                                                                                         // 38
    ns: new RegExp('^' + Meteor._escapeRegExp(self._dbName) + '\\.'),                                                 // 39
    $or: [{ op: { $in: ['i', 'u', 'd'] } },                                                                           // 40
    // drop collection                                                                                                // 42
    { op: 'c', 'o.drop': { $exists: true } }, { op: 'c', 'o.dropDatabase': 1 }]                                       // 43
  };                                                                                                                  // 38
                                                                                                                      //
  // Data structures to support waitUntilCaughtUp(). Each oplog entry has a                                           // 48
  // MongoTimestamp object on it (which is not the same as a Date --- it's a                                          // 49
  // combination of time and an incrementing counter; see                                                             // 50
  // http://docs.mongodb.org/manual/reference/bson-types/#timestamps).                                                // 51
  //                                                                                                                  // 52
  // _catchingUpFutures is an array of {ts: MongoTimestamp, future: Future}                                           // 53
  // objects, sorted by ascending timestamp. _lastProcessedTS is the                                                  // 54
  // MongoTimestamp of the last oplog entry we've processed.                                                          // 55
  //                                                                                                                  // 56
  // Each time we call waitUntilCaughtUp, we take a peek at the final oplog                                           // 57
  // entry in the db.  If we've already processed it (ie, it is not greater than                                      // 58
  // _lastProcessedTS), waitUntilCaughtUp immediately returns. Otherwise,                                             // 59
  // waitUntilCaughtUp makes a new Future and inserts it along with the final                                         // 60
  // timestamp entry that it read, into _catchingUpFutures. waitUntilCaughtUp                                         // 61
  // then waits on that future, which is resolved once _lastProcessedTS is                                            // 62
  // incremented to be past its timestamp by the worker fiber.                                                        // 63
  //                                                                                                                  // 64
  // XXX use a priority queue or something else that's faster than an array                                           // 65
  self._catchingUpFutures = [];                                                                                       // 66
  self._lastProcessedTS = null;                                                                                       // 67
                                                                                                                      //
  self._onSkippedEntriesHook = new Hook({                                                                             // 69
    debugPrintExceptions: "onSkippedEntries callback"                                                                 // 70
  });                                                                                                                 // 69
                                                                                                                      //
  self._entryQueue = new Meteor._DoubleEndedQueue();                                                                  // 73
  self._workerActive = false;                                                                                         // 74
                                                                                                                      //
  self._startTailing();                                                                                               // 76
};                                                                                                                    // 77
                                                                                                                      //
_.extend(OplogHandle.prototype, {                                                                                     // 79
  stop: function () {                                                                                                 // 80
    function stop() {                                                                                                 // 80
      var self = this;                                                                                                // 81
      if (self._stopped) return;                                                                                      // 82
      self._stopped = true;                                                                                           // 84
      if (self._tailHandle) self._tailHandle.stop();                                                                  // 85
      // XXX should close connections too                                                                             // 87
    }                                                                                                                 // 88
                                                                                                                      //
    return stop;                                                                                                      // 80
  }(),                                                                                                                // 80
  onOplogEntry: function () {                                                                                         // 89
    function onOplogEntry(trigger, callback) {                                                                        // 89
      var self = this;                                                                                                // 90
      if (self._stopped) throw new Error("Called onOplogEntry on stopped handle!");                                   // 91
                                                                                                                      //
      // Calling onOplogEntry requires us to wait for the tailing to be ready.                                        // 94
      self._readyFuture.wait();                                                                                       // 95
                                                                                                                      //
      var originalCallback = callback;                                                                                // 97
      callback = Meteor.bindEnvironment(function (notification) {                                                     // 98
        // XXX can we avoid this clone by making oplog.js careful?                                                    // 99
        originalCallback(EJSON.clone(notification));                                                                  // 100
      }, function (err) {                                                                                             // 101
        Meteor._debug("Error in oplog callback", err.stack);                                                          // 102
      });                                                                                                             // 103
      var listenHandle = self._crossbar.listen(trigger, callback);                                                    // 104
      return {                                                                                                        // 105
        stop: function () {                                                                                           // 106
          function stop() {                                                                                           // 106
            listenHandle.stop();                                                                                      // 107
          }                                                                                                           // 108
                                                                                                                      //
          return stop;                                                                                                // 106
        }()                                                                                                           // 106
      };                                                                                                              // 105
    }                                                                                                                 // 110
                                                                                                                      //
    return onOplogEntry;                                                                                              // 89
  }(),                                                                                                                // 89
  // Register a callback to be invoked any time we skip oplog entries (eg,                                            // 111
  // because we are too far behind).                                                                                  // 112
  onSkippedEntries: function () {                                                                                     // 113
    function onSkippedEntries(callback) {                                                                             // 113
      var self = this;                                                                                                // 114
      if (self._stopped) throw new Error("Called onSkippedEntries on stopped handle!");                               // 115
      return self._onSkippedEntriesHook.register(callback);                                                           // 117
    }                                                                                                                 // 118
                                                                                                                      //
    return onSkippedEntries;                                                                                          // 113
  }(),                                                                                                                // 113
  // Calls `callback` once the oplog has been processed up to a point that is                                         // 119
  // roughly "now": specifically, once we've processed all ops that are                                               // 120
  // currently visible.                                                                                               // 121
  // XXX become convinced that this is actually safe even if oplogConnection                                          // 122
  // is some kind of pool                                                                                             // 123
  waitUntilCaughtUp: function () {                                                                                    // 124
    function waitUntilCaughtUp() {                                                                                    // 124
      var self = this;                                                                                                // 125
      if (self._stopped) throw new Error("Called waitUntilCaughtUp on stopped handle!");                              // 126
                                                                                                                      //
      // Calling waitUntilCaughtUp requries us to wait for the oplog connection to                                    // 129
      // be ready.                                                                                                    // 130
      self._readyFuture.wait();                                                                                       // 131
                                                                                                                      //
      while (!self._stopped) {                                                                                        // 133
        // We need to make the selector at least as restrictive as the actual                                         // 134
        // tailing selector (ie, we need to specify the DB name) or else we might                                     // 135
        // find a TS that won't show up in the actual tail stream.                                                    // 136
        try {                                                                                                         // 137
          var lastEntry = self._oplogLastEntryConnection.findOne(OPLOG_COLLECTION, self._baseOplogSelector, { fields: { ts: 1 }, sort: { $natural: -1 } });
          break;                                                                                                      // 141
        } catch (e) {                                                                                                 // 142
          // During failover (eg) if we get an exception we should log and retry                                      // 143
          // instead of crashing.                                                                                     // 144
          Meteor._debug("Got exception while reading last entry: " + e);                                              // 145
          Meteor._sleepForMs(100);                                                                                    // 146
        }                                                                                                             // 147
      }                                                                                                               // 148
                                                                                                                      //
      if (self._stopped) return;                                                                                      // 150
                                                                                                                      //
      if (!lastEntry) {                                                                                               // 153
        // Really, nothing in the oplog? Well, we've processed everything.                                            // 154
        return;                                                                                                       // 155
      }                                                                                                               // 156
                                                                                                                      //
      var ts = lastEntry.ts;                                                                                          // 158
      if (!ts) throw Error("oplog entry without ts: " + EJSON.stringify(lastEntry));                                  // 159
                                                                                                                      //
      if (self._lastProcessedTS && ts.lessThanOrEqual(self._lastProcessedTS)) {                                       // 162
        // We've already caught up to here.                                                                           // 163
        return;                                                                                                       // 164
      }                                                                                                               // 165
                                                                                                                      //
      // Insert the future into our list. Almost always, this will be at the end,                                     // 168
      // but it's conceivable that if we fail over from one primary to another,                                       // 169
      // the oplog entries we see will go backwards.                                                                  // 170
      var insertAfter = self._catchingUpFutures.length;                                                               // 171
      while (insertAfter - 1 > 0 && self._catchingUpFutures[insertAfter - 1].ts.greaterThan(ts)) {                    // 172
        insertAfter--;                                                                                                // 174
      }                                                                                                               // 175
      var f = new Future();                                                                                           // 176
      self._catchingUpFutures.splice(insertAfter, 0, { ts: ts, future: f });                                          // 177
      f.wait();                                                                                                       // 178
    }                                                                                                                 // 179
                                                                                                                      //
    return waitUntilCaughtUp;                                                                                         // 124
  }(),                                                                                                                // 124
  _startTailing: function () {                                                                                        // 180
    function _startTailing() {                                                                                        // 180
      var self = this;                                                                                                // 181
      // First, make sure that we're talking to the local database.                                                   // 182
      var mongodbUri = Npm.require('mongodb-uri');                                                                    // 183
      if (mongodbUri.parse(self._oplogUrl).database !== 'local') {                                                    // 184
        throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " + "a Mongo replica set");              // 185
      }                                                                                                               // 187
                                                                                                                      //
      // We make two separate connections to Mongo. The Node Mongo driver                                             // 189
      // implements a naive round-robin connection pool: each "connection" is a                                       // 190
      // pool of several (5 by default) TCP connections, and each request is                                          // 191
      // rotated through the pools. Tailable cursor queries block on the server                                       // 192
      // until there is some data to return (or until a few seconds have                                              // 193
      // passed). So if the connection pool used for tailing cursors is the same                                      // 194
      // pool used for other queries, the other queries will be delayed by seconds                                    // 195
      // 1/5 of the time.                                                                                             // 196
      //                                                                                                              // 197
      // The tail connection will only ever be running a single tail command, so                                      // 198
      // it only needs to make one underlying TCP connection.                                                         // 199
      self._oplogTailConnection = new MongoConnection(self._oplogUrl, { poolSize: 1 });                               // 200
      // XXX better docs, but: it's to get monotonic results                                                          // 202
      // XXX is it safe to say "if there's an in flight query, just use its                                           // 203
      //     results"? I don't think so but should consider that                                                      // 204
      self._oplogLastEntryConnection = new MongoConnection(self._oplogUrl, { poolSize: 1 });                          // 205
                                                                                                                      //
      // Now, make sure that there actually is a repl set here. If not, oplog                                         // 208
      // tailing won't ever find anything!                                                                            // 209
      // More on the isMasterDoc                                                                                      // 210
      // https://docs.mongodb.com/manual/reference/command/isMaster/                                                  // 211
      var f = new Future();                                                                                           // 212
      self._oplogLastEntryConnection.db.admin().command({ ismaster: 1 }, f.resolver());                               // 213
      var isMasterDoc = f.wait();                                                                                     // 215
                                                                                                                      //
      if (!(isMasterDoc && isMasterDoc.setName)) {                                                                    // 217
        throw Error("$MONGO_OPLOG_URL must be set to the 'local' database of " + "a Mongo replica set");              // 218
      }                                                                                                               // 220
                                                                                                                      //
      // Find the last oplog entry.                                                                                   // 222
      var lastOplogEntry = self._oplogLastEntryConnection.findOne(OPLOG_COLLECTION, {}, { sort: { $natural: -1 }, fields: { ts: 1 } });
                                                                                                                      //
      var oplogSelector = _.clone(self._baseOplogSelector);                                                           // 226
      if (lastOplogEntry) {                                                                                           // 227
        // Start after the last entry that currently exists.                                                          // 228
        oplogSelector.ts = { $gt: lastOplogEntry.ts };                                                                // 229
        // If there are any calls to callWhenProcessedLatest before any other                                         // 230
        // oplog entries show up, allow callWhenProcessedLatest to call its                                           // 231
        // callback immediately.                                                                                      // 232
        self._lastProcessedTS = lastOplogEntry.ts;                                                                    // 233
      }                                                                                                               // 234
                                                                                                                      //
      var cursorDescription = new CursorDescription(OPLOG_COLLECTION, oplogSelector, { tailable: true });             // 236
                                                                                                                      //
      self._tailHandle = self._oplogTailConnection.tail(cursorDescription, function (doc) {                           // 239
        self._entryQueue.push(doc);                                                                                   // 241
        self._maybeStartWorker();                                                                                     // 242
      });                                                                                                             // 243
      self._readyFuture['return']();                                                                                  // 245
    }                                                                                                                 // 246
                                                                                                                      //
    return _startTailing;                                                                                             // 180
  }(),                                                                                                                // 180
                                                                                                                      //
  _maybeStartWorker: function () {                                                                                    // 248
    function _maybeStartWorker() {                                                                                    // 248
      var self = this;                                                                                                // 249
      if (self._workerActive) return;                                                                                 // 250
      self._workerActive = true;                                                                                      // 252
      Meteor.defer(function () {                                                                                      // 253
        try {                                                                                                         // 254
          while (!self._stopped && !self._entryQueue.isEmpty()) {                                                     // 255
            // Are we too far behind? Just tell our observers that they need to                                       // 256
            // repoll, and drop our queue.                                                                            // 257
            if (self._entryQueue.length > TOO_FAR_BEHIND) {                                                           // 258
              var lastEntry = self._entryQueue.pop();                                                                 // 259
              self._entryQueue.clear();                                                                               // 260
                                                                                                                      //
              self._onSkippedEntriesHook.each(function (callback) {                                                   // 262
                callback();                                                                                           // 263
                return true;                                                                                          // 264
              });                                                                                                     // 265
                                                                                                                      //
              // Free any waitUntilCaughtUp() calls that were waiting for us to                                       // 267
              // pass something that we just skipped.                                                                 // 268
              self._setLastProcessedTS(lastEntry.ts);                                                                 // 269
              continue;                                                                                               // 270
            }                                                                                                         // 271
                                                                                                                      //
            var doc = self._entryQueue.shift();                                                                       // 273
                                                                                                                      //
            if (!(doc.ns && doc.ns.length > self._dbName.length + 1 && doc.ns.substr(0, self._dbName.length + 1) === self._dbName + '.')) {
              throw new Error("Unexpected ns");                                                                       // 278
            }                                                                                                         // 279
                                                                                                                      //
            var trigger = { collection: doc.ns.substr(self._dbName.length + 1),                                       // 281
              dropCollection: false,                                                                                  // 282
              dropDatabase: false,                                                                                    // 283
              op: doc };                                                                                              // 284
                                                                                                                      //
            // Is it a special command and the collection name is hidden somewhere                                    // 286
            // in operator?                                                                                           // 287
            if (trigger.collection === "$cmd") {                                                                      // 288
              if (doc.o.dropDatabase) {                                                                               // 289
                delete trigger.collection;                                                                            // 290
                trigger.dropDatabase = true;                                                                          // 291
              } else if (_.has(doc.o, 'drop')) {                                                                      // 292
                trigger.collection = doc.o.drop;                                                                      // 293
                trigger.dropCollection = true;                                                                        // 294
                trigger.id = null;                                                                                    // 295
              } else {                                                                                                // 296
                throw Error("Unknown command " + JSON.stringify(doc));                                                // 297
              }                                                                                                       // 298
            } else {                                                                                                  // 299
              // All other ops have an id.                                                                            // 300
              trigger.id = idForOp(doc);                                                                              // 301
            }                                                                                                         // 302
                                                                                                                      //
            self._crossbar.fire(trigger);                                                                             // 304
                                                                                                                      //
            // Now that we've processed this operation, process pending                                               // 306
            // sequencers.                                                                                            // 307
            if (!doc.ts) throw Error("oplog entry without ts: " + EJSON.stringify(doc));                              // 308
            self._setLastProcessedTS(doc.ts);                                                                         // 310
          }                                                                                                           // 311
        } finally {                                                                                                   // 312
          self._workerActive = false;                                                                                 // 313
        }                                                                                                             // 314
      });                                                                                                             // 315
    }                                                                                                                 // 316
                                                                                                                      //
    return _maybeStartWorker;                                                                                         // 248
  }(),                                                                                                                // 248
  _setLastProcessedTS: function () {                                                                                  // 317
    function _setLastProcessedTS(ts) {                                                                                // 317
      var self = this;                                                                                                // 318
      self._lastProcessedTS = ts;                                                                                     // 319
      while (!_.isEmpty(self._catchingUpFutures) && self._catchingUpFutures[0].ts.lessThanOrEqual(self._lastProcessedTS)) {
        var sequencer = self._catchingUpFutures.shift();                                                              // 323
        sequencer.future['return']();                                                                                 // 324
      }                                                                                                               // 325
    }                                                                                                                 // 326
                                                                                                                      //
    return _setLastProcessedTS;                                                                                       // 317
  }(),                                                                                                                // 317
                                                                                                                      //
  //Methods used on tests to dinamically change TOO_FAR_BEHIND                                                        // 328
  _defineTooFarBehind: function () {                                                                                  // 329
    function _defineTooFarBehind(value) {                                                                             // 329
      TOO_FAR_BEHIND = value;                                                                                         // 330
    }                                                                                                                 // 331
                                                                                                                      //
    return _defineTooFarBehind;                                                                                       // 329
  }(),                                                                                                                // 329
  _resetTooFarBehind: function () {                                                                                   // 332
    function _resetTooFarBehind() {                                                                                   // 332
      TOO_FAR_BEHIND = process.env.METEOR_OPLOG_TOO_FAR_BEHIND || 2000;                                               // 333
    }                                                                                                                 // 334
                                                                                                                      //
    return _resetTooFarBehind;                                                                                        // 332
  }()                                                                                                                 // 332
});                                                                                                                   // 79
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"observe_multiplex.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/observe_multiplex.js                                                                                //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Future = Npm.require('fibers/future');                                                                            // 1
                                                                                                                      //
ObserveMultiplexer = function ObserveMultiplexer(options) {                                                           // 3
  var self = this;                                                                                                    // 4
                                                                                                                      //
  if (!options || !_.has(options, 'ordered')) throw Error("must specified ordered");                                  // 6
                                                                                                                      //
  Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-multiplexers", 1);              // 9
                                                                                                                      //
  self._ordered = options.ordered;                                                                                    // 12
  self._onStop = options.onStop || function () {};                                                                    // 13
  self._queue = new Meteor._SynchronousQueue();                                                                       // 14
  self._handles = {};                                                                                                 // 15
  self._readyFuture = new Future();                                                                                   // 16
  self._cache = new LocalCollection._CachingChangeObserver({                                                          // 17
    ordered: options.ordered });                                                                                      // 18
  // Number of addHandleAndSendInitialAdds tasks scheduled but not yet                                                // 19
  // running. removeHandle uses this to know if it's time to call the onStop                                          // 20
  // callback.                                                                                                        // 21
  self._addHandleTasksScheduledButNotPerformed = 0;                                                                   // 22
                                                                                                                      //
  _.each(self.callbackNames(), function (callbackName) {                                                              // 24
    self[callbackName] = function () /* ... */{                                                                       // 25
      self._applyCallback(callbackName, _.toArray(arguments));                                                        // 26
    };                                                                                                                // 27
  });                                                                                                                 // 28
};                                                                                                                    // 29
                                                                                                                      //
_.extend(ObserveMultiplexer.prototype, {                                                                              // 31
  addHandleAndSendInitialAdds: function () {                                                                          // 32
    function addHandleAndSendInitialAdds(handle) {                                                                    // 32
      var self = this;                                                                                                // 33
                                                                                                                      //
      // Check this before calling runTask (even though runTask does the same                                         // 35
      // check) so that we don't leak an ObserveMultiplexer on error by                                               // 36
      // incrementing _addHandleTasksScheduledButNotPerformed and never                                               // 37
      // decrementing it.                                                                                             // 38
      if (!self._queue.safeToRunTask()) throw new Error("Can't call observeChanges from an observe callback on the same query");
      ++self._addHandleTasksScheduledButNotPerformed;                                                                 // 42
                                                                                                                      //
      Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-handles", 1);               // 44
                                                                                                                      //
      self._queue.runTask(function () {                                                                               // 47
        self._handles[handle._id] = handle;                                                                           // 48
        // Send out whatever adds we have so far (whether or not we the                                               // 49
        // multiplexer is ready).                                                                                     // 50
        self._sendAdds(handle);                                                                                       // 51
        --self._addHandleTasksScheduledButNotPerformed;                                                               // 52
      });                                                                                                             // 53
      // *outside* the task, since otherwise we'd deadlock                                                            // 54
      self._readyFuture.wait();                                                                                       // 55
    }                                                                                                                 // 56
                                                                                                                      //
    return addHandleAndSendInitialAdds;                                                                               // 32
  }(),                                                                                                                // 32
                                                                                                                      //
  // Remove an observe handle. If it was the last observe handle, call the                                            // 58
  // onStop callback; you cannot add any more observe handles after this.                                             // 59
  //                                                                                                                  // 60
  // This is not synchronized with polls and handle additions: this means that                                        // 61
  // you can safely call it from within an observe callback, but it also means                                        // 62
  // that we have to be careful when we iterate over _handles.                                                        // 63
  removeHandle: function () {                                                                                         // 64
    function removeHandle(id) {                                                                                       // 64
      var self = this;                                                                                                // 65
                                                                                                                      //
      // This should not be possible: you can only call removeHandle by having                                        // 67
      // access to the ObserveHandle, which isn't returned to user code until the                                     // 68
      // multiplex is ready.                                                                                          // 69
      if (!self._ready()) throw new Error("Can't remove handles until the multiplex is ready");                       // 70
                                                                                                                      //
      delete self._handles[id];                                                                                       // 73
                                                                                                                      //
      Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-handles", -1);              // 75
                                                                                                                      //
      if (_.isEmpty(self._handles) && self._addHandleTasksScheduledButNotPerformed === 0) {                           // 78
        self._stop();                                                                                                 // 80
      }                                                                                                               // 81
    }                                                                                                                 // 82
                                                                                                                      //
    return removeHandle;                                                                                              // 64
  }(),                                                                                                                // 64
  _stop: function () {                                                                                                // 83
    function _stop(options) {                                                                                         // 83
      var self = this;                                                                                                // 84
      options = options || {};                                                                                        // 85
                                                                                                                      //
      // It shouldn't be possible for us to stop when all our handles still                                           // 87
      // haven't been returned from observeChanges!                                                                   // 88
      if (!self._ready() && !options.fromQueryError) throw Error("surprising _stop: not ready");                      // 89
                                                                                                                      //
      // Call stop callback (which kills the underlying process which sends us                                        // 92
      // callbacks and removes us from the connection's dictionary).                                                  // 93
      self._onStop();                                                                                                 // 94
      Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-multiplexers", -1);         // 95
                                                                                                                      //
      // Cause future addHandleAndSendInitialAdds calls to throw (but the onStop                                      // 98
      // callback should make our connection forget about us).                                                        // 99
      self._handles = null;                                                                                           // 100
    }                                                                                                                 // 101
                                                                                                                      //
    return _stop;                                                                                                     // 83
  }(),                                                                                                                // 83
                                                                                                                      //
  // Allows all addHandleAndSendInitialAdds calls to return, once all preceding                                       // 103
  // adds have been processed. Does not block.                                                                        // 104
  ready: function () {                                                                                                // 105
    function ready() {                                                                                                // 105
      var self = this;                                                                                                // 106
      self._queue.queueTask(function () {                                                                             // 107
        if (self._ready()) throw Error("can't make ObserveMultiplex ready twice!");                                   // 108
        self._readyFuture['return']();                                                                                // 110
      });                                                                                                             // 111
    }                                                                                                                 // 112
                                                                                                                      //
    return ready;                                                                                                     // 105
  }(),                                                                                                                // 105
                                                                                                                      //
  // If trying to execute the query results in an error, call this. This is                                           // 114
  // intended for permanent errors, not transient network errors that could be                                        // 115
  // fixed. It should only be called before ready(), because if you called ready                                      // 116
  // that meant that you managed to run the query once. It will stop this                                             // 117
  // ObserveMultiplex and cause addHandleAndSendInitialAdds calls (and thus                                           // 118
  // observeChanges calls) to throw the error.                                                                        // 119
  queryError: function () {                                                                                           // 120
    function queryError(err) {                                                                                        // 120
      var self = this;                                                                                                // 121
      self._queue.runTask(function () {                                                                               // 122
        if (self._ready()) throw Error("can't claim query has an error after it worked!");                            // 123
        self._stop({ fromQueryError: true });                                                                         // 125
        self._readyFuture['throw'](err);                                                                              // 126
      });                                                                                                             // 127
    }                                                                                                                 // 128
                                                                                                                      //
    return queryError;                                                                                                // 120
  }(),                                                                                                                // 120
                                                                                                                      //
  // Calls "cb" once the effects of all "ready", "addHandleAndSendInitialAdds"                                        // 130
  // and observe callbacks which came before this call have been propagated to                                        // 131
  // all handles. "ready" must have already been called on this multiplexer.                                          // 132
  onFlush: function () {                                                                                              // 133
    function onFlush(cb) {                                                                                            // 133
      var self = this;                                                                                                // 134
      self._queue.queueTask(function () {                                                                             // 135
        if (!self._ready()) throw Error("only call onFlush on a multiplexer that will be ready");                     // 136
        cb();                                                                                                         // 138
      });                                                                                                             // 139
    }                                                                                                                 // 140
                                                                                                                      //
    return onFlush;                                                                                                   // 133
  }(),                                                                                                                // 133
  callbackNames: function () {                                                                                        // 141
    function callbackNames() {                                                                                        // 141
      var self = this;                                                                                                // 142
      if (self._ordered) return ["addedBefore", "changed", "movedBefore", "removed"];else return ["added", "changed", "removed"];
    }                                                                                                                 // 147
                                                                                                                      //
    return callbackNames;                                                                                             // 141
  }(),                                                                                                                // 141
  _ready: function () {                                                                                               // 148
    function _ready() {                                                                                               // 148
      return this._readyFuture.isResolved();                                                                          // 149
    }                                                                                                                 // 150
                                                                                                                      //
    return _ready;                                                                                                    // 148
  }(),                                                                                                                // 148
  _applyCallback: function () {                                                                                       // 151
    function _applyCallback(callbackName, args) {                                                                     // 151
      var self = this;                                                                                                // 152
      self._queue.queueTask(function () {                                                                             // 153
        // If we stopped in the meantime, do nothing.                                                                 // 154
        if (!self._handles) return;                                                                                   // 155
                                                                                                                      //
        // First, apply the change to the cache.                                                                      // 158
        // XXX We could make applyChange callbacks promise not to hang on to any                                      // 159
        // state from their arguments (assuming that their supplied callbacks                                         // 160
        // don't) and skip this clone. Currently 'changed' hangs on to state                                          // 161
        // though.                                                                                                    // 162
        self._cache.applyChange[callbackName].apply(null, EJSON.clone(args));                                         // 163
                                                                                                                      //
        // If we haven't finished the initial adds, then we should only be getting                                    // 165
        // adds.                                                                                                      // 166
        if (!self._ready() && callbackName !== 'added' && callbackName !== 'addedBefore') {                           // 167
          throw new Error("Got " + callbackName + " during initial adds");                                            // 169
        }                                                                                                             // 170
                                                                                                                      //
        // Now multiplex the callbacks out to all observe handles. It's OK if                                         // 172
        // these calls yield; since we're inside a task, no other use of our queue                                    // 173
        // can continue until these are done. (But we do have to be careful to not                                    // 174
        // use a handle that got removed, because removeHandle does not use the                                       // 175
        // queue; thus, we iterate over an array of keys that we control.)                                            // 176
        _.each(_.keys(self._handles), function (handleId) {                                                           // 177
          var handle = self._handles && self._handles[handleId];                                                      // 178
          if (!handle) return;                                                                                        // 179
          var callback = handle['_' + callbackName];                                                                  // 181
          // clone arguments so that callbacks can mutate their arguments                                             // 182
          callback && callback.apply(null, EJSON.clone(args));                                                        // 183
        });                                                                                                           // 184
      });                                                                                                             // 185
    }                                                                                                                 // 186
                                                                                                                      //
    return _applyCallback;                                                                                            // 151
  }(),                                                                                                                // 151
                                                                                                                      //
  // Sends initial adds to a handle. It should only be called from within a task                                      // 188
  // (the task that is processing the addHandleAndSendInitialAdds call). It                                           // 189
  // synchronously invokes the handle's added or addedBefore; there's no need to                                      // 190
  // flush the queue afterwards to ensure that the callbacks get out.                                                 // 191
  _sendAdds: function () {                                                                                            // 192
    function _sendAdds(handle) {                                                                                      // 192
      var self = this;                                                                                                // 193
      if (self._queue.safeToRunTask()) throw Error("_sendAdds may only be called from within a task!");               // 194
      var add = self._ordered ? handle._addedBefore : handle._added;                                                  // 196
      if (!add) return;                                                                                               // 197
      // note: docs may be an _IdMap or an OrderedDict                                                                // 199
      self._cache.docs.forEach(function (doc, id) {                                                                   // 200
        if (!_.has(self._handles, handle._id)) throw Error("handle got removed before sending initial adds!");        // 201
        var fields = EJSON.clone(doc);                                                                                // 203
        delete fields._id;                                                                                            // 204
        if (self._ordered) add(id, fields, null); // we're going in order, so add at end                              // 205
        else add(id, fields);                                                                                         // 205
      });                                                                                                             // 209
    }                                                                                                                 // 210
                                                                                                                      //
    return _sendAdds;                                                                                                 // 192
  }()                                                                                                                 // 192
});                                                                                                                   // 31
                                                                                                                      //
var nextObserveHandleId = 1;                                                                                          // 214
ObserveHandle = function ObserveHandle(multiplexer, callbacks) {                                                      // 215
  var self = this;                                                                                                    // 216
  // The end user is only supposed to call stop().  The other fields are                                              // 217
  // accessible to the multiplexer, though.                                                                           // 218
  self._multiplexer = multiplexer;                                                                                    // 219
  _.each(multiplexer.callbackNames(), function (name) {                                                               // 220
    if (callbacks[name]) {                                                                                            // 221
      self['_' + name] = callbacks[name];                                                                             // 222
    } else if (name === "addedBefore" && callbacks.added) {                                                           // 223
      // Special case: if you specify "added" and "movedBefore", you get an                                           // 224
      // ordered observe where for some reason you don't get ordering data on                                         // 225
      // the adds.  I dunno, we wrote tests for it, there must have been a                                            // 226
      // reason.                                                                                                      // 227
      self._addedBefore = function (id, fields, before) {                                                             // 228
        callbacks.added(id, fields);                                                                                  // 229
      };                                                                                                              // 230
    }                                                                                                                 // 231
  });                                                                                                                 // 232
  self._stopped = false;                                                                                              // 233
  self._id = nextObserveHandleId++;                                                                                   // 234
};                                                                                                                    // 235
ObserveHandle.prototype.stop = function () {                                                                          // 236
  var self = this;                                                                                                    // 237
  if (self._stopped) return;                                                                                          // 238
  self._stopped = true;                                                                                               // 240
  self._multiplexer.removeHandle(self._id);                                                                           // 241
};                                                                                                                    // 242
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doc_fetcher.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/doc_fetcher.js                                                                                      //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
var Future = Npm.require('fibers/future');                                                                            // 2
                                                                                                                      //
DocFetcher = function DocFetcher(mongoConnection) {                                                                   // 4
  var self = this;                                                                                                    // 5
  self._mongoConnection = mongoConnection;                                                                            // 6
  // Map from cache key -> [callback]                                                                                 // 7
  self._callbacksForCacheKey = {};                                                                                    // 8
};                                                                                                                    // 9
                                                                                                                      //
_.extend(DocFetcher.prototype, {                                                                                      // 11
  // Fetches document "id" from collectionName, returning it or null if not                                           // 12
  // found.                                                                                                           // 13
  //                                                                                                                  // 14
  // If you make multiple calls to fetch() with the same cacheKey (a string),                                         // 15
  // DocFetcher may assume that they all return the same document. (It does                                           // 16
  // not check to see if collectionName/id match.)                                                                    // 17
  //                                                                                                                  // 18
  // You may assume that callback is never called synchronously (and in fact                                          // 19
  // OplogObserveDriver does so).                                                                                     // 20
  fetch: function () {                                                                                                // 21
    function fetch(collectionName, id, cacheKey, callback) {                                                          // 21
      var self = this;                                                                                                // 22
                                                                                                                      //
      check(collectionName, String);                                                                                  // 24
      // id is some sort of scalar                                                                                    // 25
      check(cacheKey, String);                                                                                        // 26
                                                                                                                      //
      // If there's already an in-progress fetch for this cache key, yield until                                      // 28
      // it's done and return whatever it returns.                                                                    // 29
      if (_.has(self._callbacksForCacheKey, cacheKey)) {                                                              // 30
        self._callbacksForCacheKey[cacheKey].push(callback);                                                          // 31
        return;                                                                                                       // 32
      }                                                                                                               // 33
                                                                                                                      //
      var callbacks = self._callbacksForCacheKey[cacheKey] = [callback];                                              // 35
                                                                                                                      //
      Fiber(function () {                                                                                             // 37
        try {                                                                                                         // 38
          var doc = self._mongoConnection.findOne(collectionName, { _id: id }) || null;                               // 39
          // Return doc to all relevant callbacks. Note that this array can                                           // 41
          // continue to grow during callback excecution.                                                             // 42
          while (!_.isEmpty(callbacks)) {                                                                             // 43
            // Clone the document so that the various calls to fetch don't return                                     // 44
            // objects that are intertwingled with each other. Clone before                                           // 45
            // popping the future, so that if clone throws, the error gets passed                                     // 46
            // to the next callback.                                                                                  // 47
            var clonedDoc = EJSON.clone(doc);                                                                         // 48
            callbacks.pop()(null, clonedDoc);                                                                         // 49
          }                                                                                                           // 50
        } catch (e) {                                                                                                 // 51
          while (!_.isEmpty(callbacks)) {                                                                             // 52
            callbacks.pop()(e);                                                                                       // 53
          }                                                                                                           // 54
        } finally {                                                                                                   // 55
          // XXX consider keeping the doc around for a period of time before                                          // 56
          // removing from the cache                                                                                  // 57
          delete self._callbacksForCacheKey[cacheKey];                                                                // 58
        }                                                                                                             // 59
      }).run();                                                                                                       // 60
    }                                                                                                                 // 61
                                                                                                                      //
    return fetch;                                                                                                     // 21
  }()                                                                                                                 // 21
});                                                                                                                   // 11
                                                                                                                      //
MongoTest.DocFetcher = DocFetcher;                                                                                    // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"polling_observe_driver.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/polling_observe_driver.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
PollingObserveDriver = function PollingObserveDriver(options) {                                                       // 1
  var self = this;                                                                                                    // 2
                                                                                                                      //
  self._cursorDescription = options.cursorDescription;                                                                // 4
  self._mongoHandle = options.mongoHandle;                                                                            // 5
  self._ordered = options.ordered;                                                                                    // 6
  self._multiplexer = options.multiplexer;                                                                            // 7
  self._stopCallbacks = [];                                                                                           // 8
  self._stopped = false;                                                                                              // 9
                                                                                                                      //
  self._synchronousCursor = self._mongoHandle._createSynchronousCursor(self._cursorDescription);                      // 11
                                                                                                                      //
  // previous results snapshot.  on each poll cycle, diffs against                                                    // 14
  // results drives the callbacks.                                                                                    // 15
  self._results = null;                                                                                               // 16
                                                                                                                      //
  // The number of _pollMongo calls that have been added to self._taskQueue but                                       // 18
  // have not started running. Used to make sure we never schedule more than one                                      // 19
  // _pollMongo (other than possibly the one that is currently running). It's                                         // 20
  // also used by _suspendPolling to pretend there's a poll scheduled. Usually,                                       // 21
  // it's either 0 (for "no polls scheduled other than maybe one currently                                            // 22
  // running") or 1 (for "a poll scheduled that isn't running yet"), but it can                                       // 23
  // also be 2 if incremented by _suspendPolling.                                                                     // 24
  self._pollsScheduledButNotStarted = 0;                                                                              // 25
  self._pendingWrites = []; // people to notify when polling completes                                                // 26
                                                                                                                      //
  // Make sure to create a separately throttled function for each                                                     // 28
  // PollingObserveDriver object.                                                                                     // 29
  self._ensurePollIsScheduled = _.throttle(self._unthrottledEnsurePollIsScheduled, self._cursorDescription.options.pollingThrottleMs || 50 /* ms */);
                                                                                                                      //
  // XXX figure out if we still need a queue                                                                          // 34
  self._taskQueue = new Meteor._SynchronousQueue();                                                                   // 35
                                                                                                                      //
  var listenersHandle = listenAll(self._cursorDescription, function (notification) {                                  // 37
    // When someone does a transaction that might affect us, schedule a poll                                          // 39
    // of the database. If that transaction happens inside of a write fence,                                          // 40
    // block the fence until we've polled and notified observers.                                                     // 41
    var fence = DDPServer._CurrentWriteFence.get();                                                                   // 42
    if (fence) self._pendingWrites.push(fence.beginWrite());                                                          // 43
    // Ensure a poll is scheduled... but if we already know that one is,                                              // 45
    // don't hit the throttled _ensurePollIsScheduled function (which might                                           // 46
    // lead to us calling it unnecessarily in <pollingThrottleMs> ms).                                                // 47
    if (self._pollsScheduledButNotStarted === 0) self._ensurePollIsScheduled();                                       // 48
  });                                                                                                                 // 50
  self._stopCallbacks.push(function () {                                                                              // 52
    listenersHandle.stop();                                                                                           // 52
  });                                                                                                                 // 52
                                                                                                                      //
  // every once and a while, poll even if we don't think we're dirty, for                                             // 54
  // eventual consistency with database writes from outside the Meteor                                                // 55
  // universe.                                                                                                        // 56
  //                                                                                                                  // 57
  // For testing, there's an undocumented callback argument to observeChanges                                         // 58
  // which disables time-based polling and gets called at the beginning of each                                       // 59
  // poll.                                                                                                            // 60
  if (options._testOnlyPollCallback) {                                                                                // 61
    self._testOnlyPollCallback = options._testOnlyPollCallback;                                                       // 62
  } else {                                                                                                            // 63
    var pollingInterval = self._cursorDescription.options.pollingIntervalMs || self._cursorDescription.options._pollingInterval || // COMPAT with 1.2
    10 * 1000;                                                                                                        // 67
    var intervalHandle = Meteor.setInterval(_.bind(self._ensurePollIsScheduled, self), pollingInterval);              // 68
    self._stopCallbacks.push(function () {                                                                            // 70
      Meteor.clearInterval(intervalHandle);                                                                           // 71
    });                                                                                                               // 72
  }                                                                                                                   // 73
                                                                                                                      //
  // Make sure we actually poll soon!                                                                                 // 75
  self._unthrottledEnsurePollIsScheduled();                                                                           // 76
                                                                                                                      //
  Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-drivers-polling", 1);           // 78
};                                                                                                                    // 80
                                                                                                                      //
_.extend(PollingObserveDriver.prototype, {                                                                            // 82
  // This is always called through _.throttle (except once at startup).                                               // 83
  _unthrottledEnsurePollIsScheduled: function () {                                                                    // 84
    function _unthrottledEnsurePollIsScheduled() {                                                                    // 84
      var self = this;                                                                                                // 85
      if (self._pollsScheduledButNotStarted > 0) return;                                                              // 86
      ++self._pollsScheduledButNotStarted;                                                                            // 88
      self._taskQueue.queueTask(function () {                                                                         // 89
        self._pollMongo();                                                                                            // 90
      });                                                                                                             // 91
    }                                                                                                                 // 92
                                                                                                                      //
    return _unthrottledEnsurePollIsScheduled;                                                                         // 84
  }(),                                                                                                                // 84
                                                                                                                      //
  // test-only interface for controlling polling.                                                                     // 94
  //                                                                                                                  // 95
  // _suspendPolling blocks until any currently running and scheduled polls are                                       // 96
  // done, and prevents any further polls from being scheduled. (new                                                  // 97
  // ObserveHandles can be added and receive their initial added callbacks,                                           // 98
  // though.)                                                                                                         // 99
  //                                                                                                                  // 100
  // _resumePolling immediately polls, and allows further polls to occur.                                             // 101
  _suspendPolling: function () {                                                                                      // 102
    function _suspendPolling() {                                                                                      // 102
      var self = this;                                                                                                // 103
      // Pretend that there's another poll scheduled (which will prevent                                              // 104
      // _ensurePollIsScheduled from queueing any more polls).                                                        // 105
      ++self._pollsScheduledButNotStarted;                                                                            // 106
      // Now block until all currently running or scheduled polls are done.                                           // 107
      self._taskQueue.runTask(function () {});                                                                        // 108
                                                                                                                      //
      // Confirm that there is only one "poll" (the fake one we're pretending to                                      // 110
      // have) scheduled.                                                                                             // 111
      if (self._pollsScheduledButNotStarted !== 1) throw new Error("_pollsScheduledButNotStarted is " + self._pollsScheduledButNotStarted);
    }                                                                                                                 // 115
                                                                                                                      //
    return _suspendPolling;                                                                                           // 102
  }(),                                                                                                                // 102
  _resumePolling: function () {                                                                                       // 116
    function _resumePolling() {                                                                                       // 116
      var self = this;                                                                                                // 117
      // We should be in the same state as in the end of _suspendPolling.                                             // 118
      if (self._pollsScheduledButNotStarted !== 1) throw new Error("_pollsScheduledButNotStarted is " + self._pollsScheduledButNotStarted);
      // Run a poll synchronously (which will counteract the                                                          // 122
      // ++_pollsScheduledButNotStarted from _suspendPolling).                                                        // 123
      self._taskQueue.runTask(function () {                                                                           // 124
        self._pollMongo();                                                                                            // 125
      });                                                                                                             // 126
    }                                                                                                                 // 127
                                                                                                                      //
    return _resumePolling;                                                                                            // 116
  }(),                                                                                                                // 116
                                                                                                                      //
  _pollMongo: function () {                                                                                           // 129
    function _pollMongo() {                                                                                           // 129
      var self = this;                                                                                                // 130
      --self._pollsScheduledButNotStarted;                                                                            // 131
                                                                                                                      //
      if (self._stopped) return;                                                                                      // 133
                                                                                                                      //
      var first = false;                                                                                              // 136
      var oldResults = self._results;                                                                                 // 137
      if (!oldResults) {                                                                                              // 138
        first = true;                                                                                                 // 139
        // XXX maybe use OrderedDict instead?                                                                         // 140
        oldResults = self._ordered ? [] : new LocalCollection._IdMap();                                               // 141
      }                                                                                                               // 142
                                                                                                                      //
      self._testOnlyPollCallback && self._testOnlyPollCallback();                                                     // 144
                                                                                                                      //
      // Save the list of pending writes which this round will commit.                                                // 146
      var writesForCycle = self._pendingWrites;                                                                       // 147
      self._pendingWrites = [];                                                                                       // 148
                                                                                                                      //
      // Get the new query results. (This yields.)                                                                    // 150
      try {                                                                                                           // 151
        var newResults = self._synchronousCursor.getRawObjects(self._ordered);                                        // 152
      } catch (e) {                                                                                                   // 153
        if (first && typeof e.code === 'number') {                                                                    // 154
          // This is an error document sent to us by mongod, not a connection                                         // 155
          // error generated by the client. And we've never seen this query work                                      // 156
          // successfully. Probably it's a bad selector or something, so we should                                    // 157
          // NOT retry. Instead, we should halt the observe (which ends up calling                                    // 158
          // `stop` on us).                                                                                           // 159
          self._multiplexer.queryError(new Error("Exception while polling query " + JSON.stringify(self._cursorDescription) + ": " + e.message));
          return;                                                                                                     // 164
        }                                                                                                             // 165
                                                                                                                      //
        // getRawObjects can throw if we're having trouble talking to the                                             // 167
        // database.  That's fine --- we will repoll later anyway. But we should                                      // 168
        // make sure not to lose track of this cycle's writes.                                                        // 169
        // (It also can throw if there's just something invalid about this query;                                     // 170
        // unfortunately the ObserveDriver API doesn't provide a good way to                                          // 171
        // "cancel" the observe from the inside in this case.                                                         // 172
        Array.prototype.push.apply(self._pendingWrites, writesForCycle);                                              // 173
        Meteor._debug("Exception while polling query " + JSON.stringify(self._cursorDescription) + ": " + e.stack);   // 174
        return;                                                                                                       // 176
      }                                                                                                               // 177
                                                                                                                      //
      // Run diffs.                                                                                                   // 179
      if (!self._stopped) {                                                                                           // 180
        LocalCollection._diffQueryChanges(self._ordered, oldResults, newResults, self._multiplexer);                  // 181
      }                                                                                                               // 183
                                                                                                                      //
      // Signals the multiplexer to allow all observeChanges calls that share this                                    // 185
      // multiplexer to return. (This happens asynchronously, via the                                                 // 186
      // multiplexer's queue.)                                                                                        // 187
      if (first) self._multiplexer.ready();                                                                           // 188
                                                                                                                      //
      // Replace self._results atomically.  (This assignment is what makes `first`                                    // 191
      // stay through on the next cycle, so we've waited until after we've                                            // 192
      // committed to ready-ing the multiplexer.)                                                                     // 193
      self._results = newResults;                                                                                     // 194
                                                                                                                      //
      // Once the ObserveMultiplexer has processed everything we've done in this                                      // 196
      // round, mark all the writes which existed before this call as                                                 // 197
      // commmitted. (If new writes have shown up in the meantime, there'll                                           // 198
      // already be another _pollMongo task scheduled.)                                                               // 199
      self._multiplexer.onFlush(function () {                                                                         // 200
        _.each(writesForCycle, function (w) {                                                                         // 201
          w.committed();                                                                                              // 202
        });                                                                                                           // 203
      });                                                                                                             // 204
    }                                                                                                                 // 205
                                                                                                                      //
    return _pollMongo;                                                                                                // 129
  }(),                                                                                                                // 129
                                                                                                                      //
  stop: function () {                                                                                                 // 207
    function stop() {                                                                                                 // 207
      var self = this;                                                                                                // 208
      self._stopped = true;                                                                                           // 209
      _.each(self._stopCallbacks, function (c) {                                                                      // 210
        c();                                                                                                          // 210
      });                                                                                                             // 210
      // Release any write fences that are waiting on us.                                                             // 211
      _.each(self._pendingWrites, function (w) {                                                                      // 212
        w.committed();                                                                                                // 213
      });                                                                                                             // 214
      Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-drivers-polling", -1);      // 215
    }                                                                                                                 // 217
                                                                                                                      //
    return stop;                                                                                                      // 207
  }()                                                                                                                 // 207
});                                                                                                                   // 82
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"oplog_observe_driver.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/oplog_observe_driver.js                                                                             //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
var Fiber = Npm.require('fibers');                                                                                    // 1
var Future = Npm.require('fibers/future');                                                                            // 2
                                                                                                                      //
var PHASE = {                                                                                                         // 4
  QUERYING: "QUERYING",                                                                                               // 5
  FETCHING: "FETCHING",                                                                                               // 6
  STEADY: "STEADY"                                                                                                    // 7
};                                                                                                                    // 4
                                                                                                                      //
// Exception thrown by _needToPollQuery which unrolls the stack up to the                                             // 10
// enclosing call to finishIfNeedToPollQuery.                                                                         // 11
var SwitchedToQuery = function SwitchedToQuery() {};                                                                  // 12
var finishIfNeedToPollQuery = function finishIfNeedToPollQuery(f) {                                                   // 13
  return function () {                                                                                                // 14
    try {                                                                                                             // 15
      f.apply(this, arguments);                                                                                       // 16
    } catch (e) {                                                                                                     // 17
      if (!(e instanceof SwitchedToQuery)) throw e;                                                                   // 18
    }                                                                                                                 // 20
  };                                                                                                                  // 21
};                                                                                                                    // 22
                                                                                                                      //
var currentId = 0;                                                                                                    // 24
                                                                                                                      //
// OplogObserveDriver is an alternative to PollingObserveDriver which follows                                         // 26
// the Mongo operation log instead of just re-polling the query. It obeys the                                         // 27
// same simple interface: constructing it starts sending observeChanges                                               // 28
// callbacks (and a ready() invocation) to the ObserveMultiplexer, and you stop                                       // 29
// it by calling the stop() method.                                                                                   // 30
OplogObserveDriver = function OplogObserveDriver(options) {                                                           // 31
  var self = this;                                                                                                    // 32
  self._usesOplog = true; // tests look at this                                                                       // 33
                                                                                                                      //
  self._id = currentId;                                                                                               // 35
  currentId++;                                                                                                        // 36
                                                                                                                      //
  self._cursorDescription = options.cursorDescription;                                                                // 38
  self._mongoHandle = options.mongoHandle;                                                                            // 39
  self._multiplexer = options.multiplexer;                                                                            // 40
                                                                                                                      //
  if (options.ordered) {                                                                                              // 42
    throw Error("OplogObserveDriver only supports unordered observeChanges");                                         // 43
  }                                                                                                                   // 44
                                                                                                                      //
  var sorter = options.sorter;                                                                                        // 46
  // We don't support $near and other geo-queries so it's OK to initialize the                                        // 47
  // comparator only once in the constructor.                                                                         // 48
  var comparator = sorter && sorter.getComparator();                                                                  // 49
                                                                                                                      //
  if (options.cursorDescription.options.limit) {                                                                      // 51
    // There are several properties ordered driver implements:                                                        // 52
    // - _limit is a positive number                                                                                  // 53
    // - _comparator is a function-comparator by which the query is ordered                                           // 54
    // - _unpublishedBuffer is non-null Min/Max Heap,                                                                 // 55
    //                      the empty buffer in STEADY phase implies that the                                         // 56
    //                      everything that matches the queries selector fits                                         // 57
    //                      into published set.                                                                       // 58
    // - _published - Min Heap (also implements IdMap methods)                                                        // 59
                                                                                                                      //
    var heapOptions = { IdMap: LocalCollection._IdMap };                                                              // 61
    self._limit = self._cursorDescription.options.limit;                                                              // 62
    self._comparator = comparator;                                                                                    // 63
    self._sorter = sorter;                                                                                            // 64
    self._unpublishedBuffer = new MinMaxHeap(comparator, heapOptions);                                                // 65
    // We need something that can find Max value in addition to IdMap interface                                       // 66
    self._published = new MaxHeap(comparator, heapOptions);                                                           // 67
  } else {                                                                                                            // 68
    self._limit = 0;                                                                                                  // 69
    self._comparator = null;                                                                                          // 70
    self._sorter = null;                                                                                              // 71
    self._unpublishedBuffer = null;                                                                                   // 72
    self._published = new LocalCollection._IdMap();                                                                   // 73
  }                                                                                                                   // 74
                                                                                                                      //
  // Indicates if it is safe to insert a new document at the end of the buffer                                        // 76
  // for this query. i.e. it is known that there are no documents matching the                                        // 77
  // selector those are not in published or buffer.                                                                   // 78
  self._safeAppendToBuffer = false;                                                                                   // 79
                                                                                                                      //
  self._stopped = false;                                                                                              // 81
  self._stopHandles = [];                                                                                             // 82
                                                                                                                      //
  Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-drivers-oplog", 1);             // 84
                                                                                                                      //
  self._registerPhaseChange(PHASE.QUERYING);                                                                          // 87
                                                                                                                      //
  var selector = self._cursorDescription.selector;                                                                    // 89
  self._matcher = options.matcher;                                                                                    // 90
  var projection = self._cursorDescription.options.fields || {};                                                      // 91
  self._projectionFn = LocalCollection._compileProjection(projection);                                                // 92
  // Projection function, result of combining important fields for selector and                                       // 93
  // existing fields projection                                                                                       // 94
  self._sharedProjection = self._matcher.combineIntoProjection(projection);                                           // 95
  if (sorter) self._sharedProjection = sorter.combineIntoProjection(self._sharedProjection);                          // 96
  self._sharedProjectionFn = LocalCollection._compileProjection(self._sharedProjection);                              // 98
                                                                                                                      //
  self._needToFetch = new LocalCollection._IdMap();                                                                   // 101
  self._currentlyFetching = null;                                                                                     // 102
  self._fetchGeneration = 0;                                                                                          // 103
                                                                                                                      //
  self._requeryWhenDoneThisQuery = false;                                                                             // 105
  self._writesToCommitWhenWeReachSteady = [];                                                                         // 106
                                                                                                                      //
  // If the oplog handle tells us that it skipped some entries (because it got                                        // 108
  // behind, say), re-poll.                                                                                           // 109
  self._stopHandles.push(self._mongoHandle._oplogHandle.onSkippedEntries(finishIfNeedToPollQuery(function () {        // 110
    self._needToPollQuery();                                                                                          // 112
  })));                                                                                                               // 113
                                                                                                                      //
  forEachTrigger(self._cursorDescription, function (trigger) {                                                        // 116
    self._stopHandles.push(self._mongoHandle._oplogHandle.onOplogEntry(trigger, function (notification) {             // 117
      Meteor._noYieldsAllowed(finishIfNeedToPollQuery(function () {                                                   // 119
        var op = notification.op;                                                                                     // 120
        if (notification.dropCollection || notification.dropDatabase) {                                               // 121
          // Note: this call is not allowed to block on anything (especially                                          // 122
          // on waiting for oplog entries to catch up) because that will block                                        // 123
          // onOplogEntry!                                                                                            // 124
          self._needToPollQuery();                                                                                    // 125
        } else {                                                                                                      // 126
          // All other operators should be handled depending on phase                                                 // 127
          if (self._phase === PHASE.QUERYING) self._handleOplogEntryQuerying(op);else self._handleOplogEntrySteadyOrFetching(op);
        }                                                                                                             // 132
      }));                                                                                                            // 133
    }));                                                                                                              // 134
  });                                                                                                                 // 136
                                                                                                                      //
  // XXX ordering w.r.t. everything else?                                                                             // 138
  self._stopHandles.push(listenAll(self._cursorDescription, function (notification) {                                 // 139
    // If we're not in a pre-fire write fence, we don't have to do anything.                                          // 141
    var fence = DDPServer._CurrentWriteFence.get();                                                                   // 142
    if (!fence || fence.fired) return;                                                                                // 143
                                                                                                                      //
    if (fence._oplogObserveDrivers) {                                                                                 // 146
      fence._oplogObserveDrivers[self._id] = self;                                                                    // 147
      return;                                                                                                         // 148
    }                                                                                                                 // 149
                                                                                                                      //
    fence._oplogObserveDrivers = {};                                                                                  // 151
    fence._oplogObserveDrivers[self._id] = self;                                                                      // 152
                                                                                                                      //
    fence.onBeforeFire(function () {                                                                                  // 154
      var drivers = fence._oplogObserveDrivers;                                                                       // 155
      delete fence._oplogObserveDrivers;                                                                              // 156
                                                                                                                      //
      // This fence cannot fire until we've caught up to "this point" in the                                          // 158
      // oplog, and all observers made it back to the steady state.                                                   // 159
      self._mongoHandle._oplogHandle.waitUntilCaughtUp();                                                             // 160
                                                                                                                      //
      _.each(drivers, function (driver) {                                                                             // 162
        if (driver._stopped) return;                                                                                  // 163
                                                                                                                      //
        var write = fence.beginWrite();                                                                               // 166
        if (driver._phase === PHASE.STEADY) {                                                                         // 167
          // Make sure that all of the callbacks have made it through the                                             // 168
          // multiplexer and been delivered to ObserveHandles before committing                                       // 169
          // writes.                                                                                                  // 170
          driver._multiplexer.onFlush(function () {                                                                   // 171
            write.committed();                                                                                        // 172
          });                                                                                                         // 173
        } else {                                                                                                      // 174
          driver._writesToCommitWhenWeReachSteady.push(write);                                                        // 175
        }                                                                                                             // 176
      });                                                                                                             // 177
    });                                                                                                               // 178
  }));                                                                                                                // 179
                                                                                                                      //
  // When Mongo fails over, we need to repoll the query, in case we processed an                                      // 182
  // oplog entry that got rolled back.                                                                                // 183
  self._stopHandles.push(self._mongoHandle._onFailover(finishIfNeedToPollQuery(function () {                          // 184
    self._needToPollQuery();                                                                                          // 186
  })));                                                                                                               // 187
                                                                                                                      //
  // Give _observeChanges a chance to add the new ObserveHandle to our                                                // 189
  // multiplexer, so that the added calls get streamed.                                                               // 190
  Meteor.defer(finishIfNeedToPollQuery(function () {                                                                  // 191
    self._runInitialQuery();                                                                                          // 192
  }));                                                                                                                // 193
};                                                                                                                    // 194
                                                                                                                      //
_.extend(OplogObserveDriver.prototype, {                                                                              // 196
  _addPublished: function () {                                                                                        // 197
    function _addPublished(id, doc) {                                                                                 // 197
      var self = this;                                                                                                // 198
      Meteor._noYieldsAllowed(function () {                                                                           // 199
        var fields = _.clone(doc);                                                                                    // 200
        delete fields._id;                                                                                            // 201
        self._published.set(id, self._sharedProjectionFn(doc));                                                       // 202
        self._multiplexer.added(id, self._projectionFn(fields));                                                      // 203
                                                                                                                      //
        // After adding this document, the published set might be overflowed                                          // 205
        // (exceeding capacity specified by limit). If so, push the maximum                                           // 206
        // element to the buffer, we might want to save it in memory to reduce the                                    // 207
        // amount of Mongo lookups in the future.                                                                     // 208
        if (self._limit && self._published.size() > self._limit) {                                                    // 209
          // XXX in theory the size of published is no more than limit+1                                              // 210
          if (self._published.size() !== self._limit + 1) {                                                           // 211
            throw new Error("After adding to published, " + (self._published.size() - self._limit) + " documents are overflowing the set");
          }                                                                                                           // 215
                                                                                                                      //
          var overflowingDocId = self._published.maxElementId();                                                      // 217
          var overflowingDoc = self._published.get(overflowingDocId);                                                 // 218
                                                                                                                      //
          if (EJSON.equals(overflowingDocId, id)) {                                                                   // 220
            throw new Error("The document just added is overflowing the published set");                              // 221
          }                                                                                                           // 222
                                                                                                                      //
          self._published.remove(overflowingDocId);                                                                   // 224
          self._multiplexer.removed(overflowingDocId);                                                                // 225
          self._addBuffered(overflowingDocId, overflowingDoc);                                                        // 226
        }                                                                                                             // 227
      });                                                                                                             // 228
    }                                                                                                                 // 229
                                                                                                                      //
    return _addPublished;                                                                                             // 197
  }(),                                                                                                                // 197
  _removePublished: function () {                                                                                     // 230
    function _removePublished(id) {                                                                                   // 230
      var self = this;                                                                                                // 231
      Meteor._noYieldsAllowed(function () {                                                                           // 232
        self._published.remove(id);                                                                                   // 233
        self._multiplexer.removed(id);                                                                                // 234
        if (!self._limit || self._published.size() === self._limit) return;                                           // 235
                                                                                                                      //
        if (self._published.size() > self._limit) throw Error("self._published got too big");                         // 238
                                                                                                                      //
        // OK, we are publishing less than the limit. Maybe we should look in the                                     // 241
        // buffer to find the next element past what we were publishing before.                                       // 242
                                                                                                                      //
        if (!self._unpublishedBuffer.empty()) {                                                                       // 244
          // There's something in the buffer; move the first thing in it to                                           // 245
          // _published.                                                                                              // 246
          var newDocId = self._unpublishedBuffer.minElementId();                                                      // 247
          var newDoc = self._unpublishedBuffer.get(newDocId);                                                         // 248
          self._removeBuffered(newDocId);                                                                             // 249
          self._addPublished(newDocId, newDoc);                                                                       // 250
          return;                                                                                                     // 251
        }                                                                                                             // 252
                                                                                                                      //
        // There's nothing in the buffer.  This could mean one of a few things.                                       // 254
                                                                                                                      //
        // (a) We could be in the middle of re-running the query (specifically, we                                    // 256
        // could be in _publishNewResults). In that case, _unpublishedBuffer is                                       // 257
        // empty because we clear it at the beginning of _publishNewResults. In                                       // 258
        // this case, our caller already knows the entire answer to the query and                                     // 259
        // we don't need to do anything fancy here.  Just return.                                                     // 260
        if (self._phase === PHASE.QUERYING) return;                                                                   // 261
                                                                                                                      //
        // (b) We're pretty confident that the union of _published and                                                // 264
        // _unpublishedBuffer contain all documents that match selector. Because                                      // 265
        // _unpublishedBuffer is empty, that means we're confident that _published                                    // 266
        // contains all documents that match selector. So we have nothing to do.                                      // 267
        if (self._safeAppendToBuffer) return;                                                                         // 268
                                                                                                                      //
        // (c) Maybe there are other documents out there that should be in our                                        // 271
        // buffer. But in that case, when we emptied _unpublishedBuffer in                                            // 272
        // _removeBuffered, we should have called _needToPollQuery, which will                                        // 273
        // either put something in _unpublishedBuffer or set _safeAppendToBuffer                                      // 274
        // (or both), and it will put us in QUERYING for that whole time. So in                                       // 275
        // fact, we shouldn't be able to get here.                                                                    // 276
                                                                                                                      //
        throw new Error("Buffer inexplicably empty");                                                                 // 278
      });                                                                                                             // 279
    }                                                                                                                 // 280
                                                                                                                      //
    return _removePublished;                                                                                          // 230
  }(),                                                                                                                // 230
  _changePublished: function () {                                                                                     // 281
    function _changePublished(id, oldDoc, newDoc) {                                                                   // 281
      var self = this;                                                                                                // 282
      Meteor._noYieldsAllowed(function () {                                                                           // 283
        self._published.set(id, self._sharedProjectionFn(newDoc));                                                    // 284
        var projectedNew = self._projectionFn(newDoc);                                                                // 285
        var projectedOld = self._projectionFn(oldDoc);                                                                // 286
        var changed = DiffSequence.makeChangedFields(projectedNew, projectedOld);                                     // 287
        if (!_.isEmpty(changed)) self._multiplexer.changed(id, changed);                                              // 289
      });                                                                                                             // 291
    }                                                                                                                 // 292
                                                                                                                      //
    return _changePublished;                                                                                          // 281
  }(),                                                                                                                // 281
  _addBuffered: function () {                                                                                         // 293
    function _addBuffered(id, doc) {                                                                                  // 293
      var self = this;                                                                                                // 294
      Meteor._noYieldsAllowed(function () {                                                                           // 295
        self._unpublishedBuffer.set(id, self._sharedProjectionFn(doc));                                               // 296
                                                                                                                      //
        // If something is overflowing the buffer, we just remove it from cache                                       // 298
        if (self._unpublishedBuffer.size() > self._limit) {                                                           // 299
          var maxBufferedId = self._unpublishedBuffer.maxElementId();                                                 // 300
                                                                                                                      //
          self._unpublishedBuffer.remove(maxBufferedId);                                                              // 302
                                                                                                                      //
          // Since something matching is removed from cache (both published set and                                   // 304
          // buffer), set flag to false                                                                               // 305
          self._safeAppendToBuffer = false;                                                                           // 306
        }                                                                                                             // 307
      });                                                                                                             // 308
    }                                                                                                                 // 309
                                                                                                                      //
    return _addBuffered;                                                                                              // 293
  }(),                                                                                                                // 293
  // Is called either to remove the doc completely from matching set or to move                                       // 310
  // it to the published set later.                                                                                   // 311
  _removeBuffered: function () {                                                                                      // 312
    function _removeBuffered(id) {                                                                                    // 312
      var self = this;                                                                                                // 313
      Meteor._noYieldsAllowed(function () {                                                                           // 314
        self._unpublishedBuffer.remove(id);                                                                           // 315
        // To keep the contract "buffer is never empty in STEADY phase unless the                                     // 316
        // everything matching fits into published" true, we poll everything as                                       // 317
        // soon as we see the buffer becoming empty.                                                                  // 318
        if (!self._unpublishedBuffer.size() && !self._safeAppendToBuffer) self._needToPollQuery();                    // 319
      });                                                                                                             // 321
    }                                                                                                                 // 322
                                                                                                                      //
    return _removeBuffered;                                                                                           // 312
  }(),                                                                                                                // 312
  // Called when a document has joined the "Matching" results set.                                                    // 323
  // Takes responsibility of keeping _unpublishedBuffer in sync with _published                                       // 324
  // and the effect of limit enforced.                                                                                // 325
  _addMatching: function () {                                                                                         // 326
    function _addMatching(doc) {                                                                                      // 326
      var self = this;                                                                                                // 327
      Meteor._noYieldsAllowed(function () {                                                                           // 328
        var id = doc._id;                                                                                             // 329
        if (self._published.has(id)) throw Error("tried to add something already published " + id);                   // 330
        if (self._limit && self._unpublishedBuffer.has(id)) throw Error("tried to add something already existed in buffer " + id);
                                                                                                                      //
        var limit = self._limit;                                                                                      // 335
        var comparator = self._comparator;                                                                            // 336
        var maxPublished = limit && self._published.size() > 0 ? self._published.get(self._published.maxElementId()) : null;
        var maxBuffered = limit && self._unpublishedBuffer.size() > 0 ? self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId()) : null;
        // The query is unlimited or didn't publish enough documents yet or the                                       // 342
        // new document would fit into published set pushing the maximum element                                      // 343
        // out, then we need to publish the doc.                                                                      // 344
        var toPublish = !limit || self._published.size() < limit || comparator(doc, maxPublished) < 0;                // 345
                                                                                                                      //
        // Otherwise we might need to buffer it (only in case of limited query).                                      // 348
        // Buffering is allowed if the buffer is not filled up yet and all                                            // 349
        // matching docs are either in the published set or in the buffer.                                            // 350
        var canAppendToBuffer = !toPublish && self._safeAppendToBuffer && self._unpublishedBuffer.size() < limit;     // 351
                                                                                                                      //
        // Or if it is small enough to be safely inserted to the middle or the                                        // 354
        // beginning of the buffer.                                                                                   // 355
        var canInsertIntoBuffer = !toPublish && maxBuffered && comparator(doc, maxBuffered) <= 0;                     // 356
                                                                                                                      //
        var toBuffer = canAppendToBuffer || canInsertIntoBuffer;                                                      // 359
                                                                                                                      //
        if (toPublish) {                                                                                              // 361
          self._addPublished(id, doc);                                                                                // 362
        } else if (toBuffer) {                                                                                        // 363
          self._addBuffered(id, doc);                                                                                 // 364
        } else {                                                                                                      // 365
          // dropping it and not saving to the cache                                                                  // 366
          self._safeAppendToBuffer = false;                                                                           // 367
        }                                                                                                             // 368
      });                                                                                                             // 369
    }                                                                                                                 // 370
                                                                                                                      //
    return _addMatching;                                                                                              // 326
  }(),                                                                                                                // 326
  // Called when a document leaves the "Matching" results set.                                                        // 371
  // Takes responsibility of keeping _unpublishedBuffer in sync with _published                                       // 372
  // and the effect of limit enforced.                                                                                // 373
  _removeMatching: function () {                                                                                      // 374
    function _removeMatching(id) {                                                                                    // 374
      var self = this;                                                                                                // 375
      Meteor._noYieldsAllowed(function () {                                                                           // 376
        if (!self._published.has(id) && !self._limit) throw Error("tried to remove something matching but not cached " + id);
                                                                                                                      //
        if (self._published.has(id)) {                                                                                // 380
          self._removePublished(id);                                                                                  // 381
        } else if (self._unpublishedBuffer.has(id)) {                                                                 // 382
          self._removeBuffered(id);                                                                                   // 383
        }                                                                                                             // 384
      });                                                                                                             // 385
    }                                                                                                                 // 386
                                                                                                                      //
    return _removeMatching;                                                                                           // 374
  }(),                                                                                                                // 374
  _handleDoc: function () {                                                                                           // 387
    function _handleDoc(id, newDoc) {                                                                                 // 387
      var self = this;                                                                                                // 388
      Meteor._noYieldsAllowed(function () {                                                                           // 389
        var matchesNow = newDoc && self._matcher.documentMatches(newDoc).result;                                      // 390
                                                                                                                      //
        var publishedBefore = self._published.has(id);                                                                // 392
        var bufferedBefore = self._limit && self._unpublishedBuffer.has(id);                                          // 393
        var cachedBefore = publishedBefore || bufferedBefore;                                                         // 394
                                                                                                                      //
        if (matchesNow && !cachedBefore) {                                                                            // 396
          self._addMatching(newDoc);                                                                                  // 397
        } else if (cachedBefore && !matchesNow) {                                                                     // 398
          self._removeMatching(id);                                                                                   // 399
        } else if (cachedBefore && matchesNow) {                                                                      // 400
          var oldDoc = self._published.get(id);                                                                       // 401
          var comparator = self._comparator;                                                                          // 402
          var minBuffered = self._limit && self._unpublishedBuffer.size() && self._unpublishedBuffer.get(self._unpublishedBuffer.minElementId());
                                                                                                                      //
          if (publishedBefore) {                                                                                      // 406
            // Unlimited case where the document stays in published once it                                           // 407
            // matches or the case when we don't have enough matching docs to                                         // 408
            // publish or the changed but matching doc will stay in published                                         // 409
            // anyways.                                                                                               // 410
            //                                                                                                        // 411
            // XXX: We rely on the emptiness of buffer. Be sure to maintain the                                       // 412
            // fact that buffer can't be empty if there are matching documents not                                    // 413
            // published. Notably, we don't want to schedule repoll and continue                                      // 414
            // relying on this property.                                                                              // 415
            var staysInPublished = !self._limit || self._unpublishedBuffer.size() === 0 || comparator(newDoc, minBuffered) <= 0;
                                                                                                                      //
            if (staysInPublished) {                                                                                   // 420
              self._changePublished(id, oldDoc, newDoc);                                                              // 421
            } else {                                                                                                  // 422
              // after the change doc doesn't stay in the published, remove it                                        // 423
              self._removePublished(id);                                                                              // 424
              // but it can move into buffered now, check it                                                          // 425
              var maxBuffered = self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId());                  // 426
                                                                                                                      //
              var toBuffer = self._safeAppendToBuffer || maxBuffered && comparator(newDoc, maxBuffered) <= 0;         // 429
                                                                                                                      //
              if (toBuffer) {                                                                                         // 432
                self._addBuffered(id, newDoc);                                                                        // 433
              } else {                                                                                                // 434
                // Throw away from both published set and buffer                                                      // 435
                self._safeAppendToBuffer = false;                                                                     // 436
              }                                                                                                       // 437
            }                                                                                                         // 438
          } else if (bufferedBefore) {                                                                                // 439
            oldDoc = self._unpublishedBuffer.get(id);                                                                 // 440
            // remove the old version manually instead of using _removeBuffered so                                    // 441
            // we don't trigger the querying immediately.  if we end this block                                       // 442
            // with the buffer empty, we will need to trigger the query poll                                          // 443
            // manually too.                                                                                          // 444
            self._unpublishedBuffer.remove(id);                                                                       // 445
                                                                                                                      //
            var maxPublished = self._published.get(self._published.maxElementId());                                   // 447
            var maxBuffered = self._unpublishedBuffer.size() && self._unpublishedBuffer.get(self._unpublishedBuffer.maxElementId());
                                                                                                                      //
            // the buffered doc was updated, it could move to published                                               // 453
            var toPublish = comparator(newDoc, maxPublished) < 0;                                                     // 454
                                                                                                                      //
            // or stays in buffer even after the change                                                               // 456
            var staysInBuffer = !toPublish && self._safeAppendToBuffer || !toPublish && maxBuffered && comparator(newDoc, maxBuffered) <= 0;
                                                                                                                      //
            if (toPublish) {                                                                                          // 461
              self._addPublished(id, newDoc);                                                                         // 462
            } else if (staysInBuffer) {                                                                               // 463
              // stays in buffer but changes                                                                          // 464
              self._unpublishedBuffer.set(id, newDoc);                                                                // 465
            } else {                                                                                                  // 466
              // Throw away from both published set and buffer                                                        // 467
              self._safeAppendToBuffer = false;                                                                       // 468
              // Normally this check would have been done in _removeBuffered but                                      // 469
              // we didn't use it, so we need to do it ourself now.                                                   // 470
              if (!self._unpublishedBuffer.size()) {                                                                  // 471
                self._needToPollQuery();                                                                              // 472
              }                                                                                                       // 473
            }                                                                                                         // 474
          } else {                                                                                                    // 475
            throw new Error("cachedBefore implies either of publishedBefore or bufferedBefore is true.");             // 476
          }                                                                                                           // 477
        }                                                                                                             // 478
      });                                                                                                             // 479
    }                                                                                                                 // 480
                                                                                                                      //
    return _handleDoc;                                                                                                // 387
  }(),                                                                                                                // 387
  _fetchModifiedDocuments: function () {                                                                              // 481
    function _fetchModifiedDocuments() {                                                                              // 481
      var self = this;                                                                                                // 482
      Meteor._noYieldsAllowed(function () {                                                                           // 483
        self._registerPhaseChange(PHASE.FETCHING);                                                                    // 484
        // Defer, because nothing called from the oplog entry handler may yield,                                      // 485
        // but fetch() yields.                                                                                        // 486
        Meteor.defer(finishIfNeedToPollQuery(function () {                                                            // 487
          while (!self._stopped && !self._needToFetch.empty()) {                                                      // 488
            if (self._phase === PHASE.QUERYING) {                                                                     // 489
              // While fetching, we decided to go into QUERYING mode, and then we                                     // 490
              // saw another oplog entry, so _needToFetch is not empty. But we                                        // 491
              // shouldn't fetch these documents until AFTER the query is done.                                       // 492
              break;                                                                                                  // 493
            }                                                                                                         // 494
                                                                                                                      //
            // Being in steady phase here would be surprising.                                                        // 496
            if (self._phase !== PHASE.FETCHING) throw new Error("phase in fetchModifiedDocuments: " + self._phase);   // 497
                                                                                                                      //
            self._currentlyFetching = self._needToFetch;                                                              // 500
            var thisGeneration = ++self._fetchGeneration;                                                             // 501
            self._needToFetch = new LocalCollection._IdMap();                                                         // 502
            var waiting = 0;                                                                                          // 503
            var fut = new Future();                                                                                   // 504
            // This loop is safe, because _currentlyFetching will not be updated                                      // 505
            // during this loop (in fact, it is never mutated).                                                       // 506
            self._currentlyFetching.forEach(function (cacheKey, id) {                                                 // 507
              waiting++;                                                                                              // 508
              self._mongoHandle._docFetcher.fetch(self._cursorDescription.collectionName, id, cacheKey, finishIfNeedToPollQuery(function (err, doc) {
                try {                                                                                                 // 512
                  if (err) {                                                                                          // 513
                    Meteor._debug("Got exception while fetching documents: " + err);                                  // 514
                    // If we get an error from the fetcher (eg, trouble                                               // 516
                    // connecting to Mongo), let's just abandon the fetch phase                                       // 517
                    // altogether and fall back to polling. It's not like we're                                       // 518
                    // getting live updates anyway.                                                                   // 519
                    if (self._phase !== PHASE.QUERYING) {                                                             // 520
                      self._needToPollQuery();                                                                        // 521
                    }                                                                                                 // 522
                  } else if (!self._stopped && self._phase === PHASE.FETCHING && self._fetchGeneration === thisGeneration) {
                    // We re-check the generation in case we've had an explicit                                       // 525
                    // _pollQuery call (eg, in another fiber) which should                                            // 526
                    // effectively cancel this round of fetches.  (_pollQuery                                         // 527
                    // increments the generation.)                                                                    // 528
                    self._handleDoc(id, doc);                                                                         // 529
                  }                                                                                                   // 530
                } finally {                                                                                           // 531
                  waiting--;                                                                                          // 532
                  // Because fetch() never calls its callback synchronously,                                          // 533
                  // this is safe (ie, we won't call fut.return() before the                                          // 534
                  // forEach is done).                                                                                // 535
                  if (waiting === 0) fut['return']();                                                                 // 536
                }                                                                                                     // 538
              }));                                                                                                    // 539
            });                                                                                                       // 540
            fut.wait();                                                                                               // 541
            // Exit now if we've had a _pollQuery call (here or in another fiber).                                    // 542
            if (self._phase === PHASE.QUERYING) return;                                                               // 543
            self._currentlyFetching = null;                                                                           // 545
          }                                                                                                           // 546
          // We're done fetching, so we can be steady, unless we've had a                                             // 547
          // _pollQuery call (here or in another fiber).                                                              // 548
          if (self._phase !== PHASE.QUERYING) self._beSteady();                                                       // 549
        }));                                                                                                          // 551
      });                                                                                                             // 552
    }                                                                                                                 // 553
                                                                                                                      //
    return _fetchModifiedDocuments;                                                                                   // 481
  }(),                                                                                                                // 481
  _beSteady: function () {                                                                                            // 554
    function _beSteady() {                                                                                            // 554
      var self = this;                                                                                                // 555
      Meteor._noYieldsAllowed(function () {                                                                           // 556
        self._registerPhaseChange(PHASE.STEADY);                                                                      // 557
        var writes = self._writesToCommitWhenWeReachSteady;                                                           // 558
        self._writesToCommitWhenWeReachSteady = [];                                                                   // 559
        self._multiplexer.onFlush(function () {                                                                       // 560
          _.each(writes, function (w) {                                                                               // 561
            w.committed();                                                                                            // 562
          });                                                                                                         // 563
        });                                                                                                           // 564
      });                                                                                                             // 565
    }                                                                                                                 // 566
                                                                                                                      //
    return _beSteady;                                                                                                 // 554
  }(),                                                                                                                // 554
  _handleOplogEntryQuerying: function () {                                                                            // 567
    function _handleOplogEntryQuerying(op) {                                                                          // 567
      var self = this;                                                                                                // 568
      Meteor._noYieldsAllowed(function () {                                                                           // 569
        self._needToFetch.set(idForOp(op), op.ts.toString());                                                         // 570
      });                                                                                                             // 571
    }                                                                                                                 // 572
                                                                                                                      //
    return _handleOplogEntryQuerying;                                                                                 // 567
  }(),                                                                                                                // 567
  _handleOplogEntrySteadyOrFetching: function () {                                                                    // 573
    function _handleOplogEntrySteadyOrFetching(op) {                                                                  // 573
      var self = this;                                                                                                // 574
      Meteor._noYieldsAllowed(function () {                                                                           // 575
        var id = idForOp(op);                                                                                         // 576
        // If we're already fetching this one, or about to, we can't optimize;                                        // 577
        // make sure that we fetch it again if necessary.                                                             // 578
        if (self._phase === PHASE.FETCHING && (self._currentlyFetching && self._currentlyFetching.has(id) || self._needToFetch.has(id))) {
          self._needToFetch.set(id, op.ts.toString());                                                                // 582
          return;                                                                                                     // 583
        }                                                                                                             // 584
                                                                                                                      //
        if (op.op === 'd') {                                                                                          // 586
          if (self._published.has(id) || self._limit && self._unpublishedBuffer.has(id)) self._removeMatching(id);    // 587
        } else if (op.op === 'i') {                                                                                   // 590
          if (self._published.has(id)) throw new Error("insert found for already-existing ID in published");          // 591
          if (self._unpublishedBuffer && self._unpublishedBuffer.has(id)) throw new Error("insert found for already-existing ID in buffer");
                                                                                                                      //
          // XXX what if selector yields?  for now it can't but later it could                                        // 596
          // have $where                                                                                              // 597
          if (self._matcher.documentMatches(op.o).result) self._addMatching(op.o);                                    // 598
        } else if (op.op === 'u') {                                                                                   // 600
          // Is this a modifier ($set/$unset, which may require us to poll the                                        // 601
          // database to figure out if the whole document matches the selector) or                                    // 602
          // a replacement (in which case we can just directly re-evaluate the                                        // 603
          // selector)?                                                                                               // 604
          var isReplace = !_.has(op.o, '$set') && !_.has(op.o, '$unset');                                             // 605
          // If this modifier modifies something inside an EJSON custom type (ie,                                     // 606
          // anything with EJSON$), then we can't try to use                                                          // 607
          // LocalCollection._modify, since that just mutates the EJSON encoding,                                     // 608
          // not the actual object.                                                                                   // 609
          var canDirectlyModifyDoc = !isReplace && modifierCanBeDirectlyApplied(op.o);                                // 610
                                                                                                                      //
          var publishedBefore = self._published.has(id);                                                              // 613
          var bufferedBefore = self._limit && self._unpublishedBuffer.has(id);                                        // 614
                                                                                                                      //
          if (isReplace) {                                                                                            // 616
            self._handleDoc(id, _.extend({ _id: id }, op.o));                                                         // 617
          } else if ((publishedBefore || bufferedBefore) && canDirectlyModifyDoc) {                                   // 618
            // Oh great, we actually know what the document is, so we can apply                                       // 620
            // this directly.                                                                                         // 621
            var newDoc = self._published.has(id) ? self._published.get(id) : self._unpublishedBuffer.get(id);         // 622
            newDoc = EJSON.clone(newDoc);                                                                             // 624
                                                                                                                      //
            newDoc._id = id;                                                                                          // 626
            try {                                                                                                     // 627
              LocalCollection._modify(newDoc, op.o);                                                                  // 628
            } catch (e) {                                                                                             // 629
              if (e.name !== "MinimongoError") throw e;                                                               // 630
              // We didn't understand the modifier.  Re-fetch.                                                        // 632
              self._needToFetch.set(id, op.ts.toString());                                                            // 633
              if (self._phase === PHASE.STEADY) {                                                                     // 634
                self._fetchModifiedDocuments();                                                                       // 635
              }                                                                                                       // 636
              return;                                                                                                 // 637
            }                                                                                                         // 638
            self._handleDoc(id, self._sharedProjectionFn(newDoc));                                                    // 639
          } else if (!canDirectlyModifyDoc || self._matcher.canBecomeTrueByModifier(op.o) || self._sorter && self._sorter.affectedByModifier(op.o)) {
            self._needToFetch.set(id, op.ts.toString());                                                              // 643
            if (self._phase === PHASE.STEADY) self._fetchModifiedDocuments();                                         // 644
          }                                                                                                           // 646
        } else {                                                                                                      // 647
          throw Error("XXX SURPRISING OPERATION: " + op);                                                             // 648
        }                                                                                                             // 649
      });                                                                                                             // 650
    }                                                                                                                 // 651
                                                                                                                      //
    return _handleOplogEntrySteadyOrFetching;                                                                         // 573
  }(),                                                                                                                // 573
  // Yields!                                                                                                          // 652
  _runInitialQuery: function () {                                                                                     // 653
    function _runInitialQuery() {                                                                                     // 653
      var self = this;                                                                                                // 654
      if (self._stopped) throw new Error("oplog stopped surprisingly early");                                         // 655
                                                                                                                      //
      self._runQuery({ initial: true }); // yields                                                                    // 658
                                                                                                                      //
      if (self._stopped) return; // can happen on queryError                                                          // 660
                                                                                                                      //
      // Allow observeChanges calls to return. (After this, it's possible for                                         // 663
      // stop() to be called.)                                                                                        // 664
      self._multiplexer.ready();                                                                                      // 665
                                                                                                                      //
      self._doneQuerying(); // yields                                                                                 // 667
    }                                                                                                                 // 668
                                                                                                                      //
    return _runInitialQuery;                                                                                          // 653
  }(),                                                                                                                // 653
                                                                                                                      //
  // In various circumstances, we may just want to stop processing the oplog and                                      // 670
  // re-run the initial query, just as if we were a PollingObserveDriver.                                             // 671
  //                                                                                                                  // 672
  // This function may not block, because it is called from an oplog entry                                            // 673
  // handler.                                                                                                         // 674
  //                                                                                                                  // 675
  // XXX We should call this when we detect that we've been in FETCHING for "too                                      // 676
  // long".                                                                                                           // 677
  //                                                                                                                  // 678
  // XXX We should call this when we detect Mongo failover (since that might                                          // 679
  // mean that some of the oplog entries we have processed have been rolled                                           // 680
  // back). The Node Mongo driver is in the middle of a bunch of huge                                                 // 681
  // refactorings, including the way that it notifies you when primary                                                // 682
  // changes. Will put off implementing this until driver 1.4 is out.                                                 // 683
  _pollQuery: function () {                                                                                           // 684
    function _pollQuery() {                                                                                           // 684
      var self = this;                                                                                                // 685
      Meteor._noYieldsAllowed(function () {                                                                           // 686
        if (self._stopped) return;                                                                                    // 687
                                                                                                                      //
        // Yay, we get to forget about all the things we thought we had to fetch.                                     // 690
        self._needToFetch = new LocalCollection._IdMap();                                                             // 691
        self._currentlyFetching = null;                                                                               // 692
        ++self._fetchGeneration; // ignore any in-flight fetches                                                      // 693
        self._registerPhaseChange(PHASE.QUERYING);                                                                    // 694
                                                                                                                      //
        // Defer so that we don't yield.  We don't need finishIfNeedToPollQuery                                       // 696
        // here because SwitchedToQuery is not thrown in QUERYING mode.                                               // 697
        Meteor.defer(function () {                                                                                    // 698
          self._runQuery();                                                                                           // 699
          self._doneQuerying();                                                                                       // 700
        });                                                                                                           // 701
      });                                                                                                             // 702
    }                                                                                                                 // 703
                                                                                                                      //
    return _pollQuery;                                                                                                // 684
  }(),                                                                                                                // 684
                                                                                                                      //
  // Yields!                                                                                                          // 705
  _runQuery: function () {                                                                                            // 706
    function _runQuery(options) {                                                                                     // 706
      var self = this;                                                                                                // 707
      options = options || {};                                                                                        // 708
      var newResults, newBuffer;                                                                                      // 709
                                                                                                                      //
      // This while loop is just to retry failures.                                                                   // 711
      while (true) {                                                                                                  // 712
        // If we've been stopped, we don't have to run anything any more.                                             // 713
        if (self._stopped) return;                                                                                    // 714
                                                                                                                      //
        newResults = new LocalCollection._IdMap();                                                                    // 717
        newBuffer = new LocalCollection._IdMap();                                                                     // 718
                                                                                                                      //
        // Query 2x documents as the half excluded from the original query will go                                    // 720
        // into unpublished buffer to reduce additional Mongo lookups in cases                                        // 721
        // when documents are removed from the published set and need a                                               // 722
        // replacement.                                                                                               // 723
        // XXX needs more thought on non-zero skip                                                                    // 724
        // XXX 2 is a "magic number" meaning there is an extra chunk of docs for                                      // 725
        // buffer if such is needed.                                                                                  // 726
        var cursor = self._cursorForQuery({ limit: self._limit * 2 });                                                // 727
        try {                                                                                                         // 728
          cursor.forEach(function (doc, i) {                                                                          // 729
            // yields                                                                                                 // 729
            if (!self._limit || i < self._limit) newResults.set(doc._id, doc);else newBuffer.set(doc._id, doc);       // 730
          });                                                                                                         // 734
          break;                                                                                                      // 735
        } catch (e) {                                                                                                 // 736
          if (options.initial && typeof e.code === 'number') {                                                        // 737
            // This is an error document sent to us by mongod, not a connection                                       // 738
            // error generated by the client. And we've never seen this query work                                    // 739
            // successfully. Probably it's a bad selector or something, so we                                         // 740
            // should NOT retry. Instead, we should halt the observe (which ends                                      // 741
            // up calling `stop` on us).                                                                              // 742
            self._multiplexer.queryError(e);                                                                          // 743
            return;                                                                                                   // 744
          }                                                                                                           // 745
                                                                                                                      //
          // During failover (eg) if we get an exception we should log and retry                                      // 747
          // instead of crashing.                                                                                     // 748
          Meteor._debug("Got exception while polling query: " + e);                                                   // 749
          Meteor._sleepForMs(100);                                                                                    // 750
        }                                                                                                             // 751
      }                                                                                                               // 752
                                                                                                                      //
      if (self._stopped) return;                                                                                      // 754
                                                                                                                      //
      self._publishNewResults(newResults, newBuffer);                                                                 // 757
    }                                                                                                                 // 758
                                                                                                                      //
    return _runQuery;                                                                                                 // 706
  }(),                                                                                                                // 706
                                                                                                                      //
  // Transitions to QUERYING and runs another query, or (if already in QUERYING)                                      // 760
  // ensures that we will query again later.                                                                          // 761
  //                                                                                                                  // 762
  // This function may not block, because it is called from an oplog entry                                            // 763
  // handler. However, if we were not already in the QUERYING phase, it throws                                        // 764
  // an exception that is caught by the closest surrounding                                                           // 765
  // finishIfNeedToPollQuery call; this ensures that we don't continue running                                        // 766
  // close that was designed for another phase inside PHASE.QUERYING.                                                 // 767
  //                                                                                                                  // 768
  // (It's also necessary whenever logic in this file yields to check that other                                      // 769
  // phases haven't put us into QUERYING mode, though; eg,                                                            // 770
  // _fetchModifiedDocuments does this.)                                                                              // 771
  _needToPollQuery: function () {                                                                                     // 772
    function _needToPollQuery() {                                                                                     // 772
      var self = this;                                                                                                // 773
      Meteor._noYieldsAllowed(function () {                                                                           // 774
        if (self._stopped) return;                                                                                    // 775
                                                                                                                      //
        // If we're not already in the middle of a query, we can query now                                            // 778
        // (possibly pausing FETCHING).                                                                               // 779
        if (self._phase !== PHASE.QUERYING) {                                                                         // 780
          self._pollQuery();                                                                                          // 781
          throw new SwitchedToQuery();                                                                                // 782
        }                                                                                                             // 783
                                                                                                                      //
        // We're currently in QUERYING. Set a flag to ensure that we run another                                      // 785
        // query when we're done.                                                                                     // 786
        self._requeryWhenDoneThisQuery = true;                                                                        // 787
      });                                                                                                             // 788
    }                                                                                                                 // 789
                                                                                                                      //
    return _needToPollQuery;                                                                                          // 772
  }(),                                                                                                                // 772
                                                                                                                      //
  // Yields!                                                                                                          // 791
  _doneQuerying: function () {                                                                                        // 792
    function _doneQuerying() {                                                                                        // 792
      var self = this;                                                                                                // 793
                                                                                                                      //
      if (self._stopped) return;                                                                                      // 795
      self._mongoHandle._oplogHandle.waitUntilCaughtUp(); // yields                                                   // 797
      if (self._stopped) return;                                                                                      // 798
      if (self._phase !== PHASE.QUERYING) throw Error("Phase unexpectedly " + self._phase);                           // 800
                                                                                                                      //
      Meteor._noYieldsAllowed(function () {                                                                           // 803
        if (self._requeryWhenDoneThisQuery) {                                                                         // 804
          self._requeryWhenDoneThisQuery = false;                                                                     // 805
          self._pollQuery();                                                                                          // 806
        } else if (self._needToFetch.empty()) {                                                                       // 807
          self._beSteady();                                                                                           // 808
        } else {                                                                                                      // 809
          self._fetchModifiedDocuments();                                                                             // 810
        }                                                                                                             // 811
      });                                                                                                             // 812
    }                                                                                                                 // 813
                                                                                                                      //
    return _doneQuerying;                                                                                             // 792
  }(),                                                                                                                // 792
                                                                                                                      //
  _cursorForQuery: function () {                                                                                      // 815
    function _cursorForQuery(optionsOverwrite) {                                                                      // 815
      var self = this;                                                                                                // 816
      return Meteor._noYieldsAllowed(function () {                                                                    // 817
        // The query we run is almost the same as the cursor we are observing,                                        // 818
        // with a few changes. We need to read all the fields that are relevant to                                    // 819
        // the selector, not just the fields we are going to publish (that's the                                      // 820
        // "shared" projection). And we don't want to apply any transform in the                                      // 821
        // cursor, because observeChanges shouldn't use the transform.                                                // 822
        var options = _.clone(self._cursorDescription.options);                                                       // 823
                                                                                                                      //
        // Allow the caller to modify the options. Useful to specify different                                        // 825
        // skip and limit values.                                                                                     // 826
        _.extend(options, optionsOverwrite);                                                                          // 827
                                                                                                                      //
        options.fields = self._sharedProjection;                                                                      // 829
        delete options.transform;                                                                                     // 830
        // We are NOT deep cloning fields or selector here, which should be OK.                                       // 831
        var description = new CursorDescription(self._cursorDescription.collectionName, self._cursorDescription.selector, options);
        return new Cursor(self._mongoHandle, description);                                                            // 836
      });                                                                                                             // 837
    }                                                                                                                 // 838
                                                                                                                      //
    return _cursorForQuery;                                                                                           // 815
  }(),                                                                                                                // 815
                                                                                                                      //
  // Replace self._published with newResults (both are IdMaps), invoking observe                                      // 841
  // callbacks on the multiplexer.                                                                                    // 842
  // Replace self._unpublishedBuffer with newBuffer.                                                                  // 843
  //                                                                                                                  // 844
  // XXX This is very similar to LocalCollection._diffQueryUnorderedChanges. We                                       // 845
  // should really: (a) Unify IdMap and OrderedDict into Unordered/OrderedDict                                        // 846
  // (b) Rewrite diff.js to use these classes instead of arrays and objects.                                          // 847
  _publishNewResults: function () {                                                                                   // 848
    function _publishNewResults(newResults, newBuffer) {                                                              // 848
      var self = this;                                                                                                // 849
      Meteor._noYieldsAllowed(function () {                                                                           // 850
                                                                                                                      //
        // If the query is limited and there is a buffer, shut down so it doesn't                                     // 852
        // stay in a way.                                                                                             // 853
        if (self._limit) {                                                                                            // 854
          self._unpublishedBuffer.clear();                                                                            // 855
        }                                                                                                             // 856
                                                                                                                      //
        // First remove anything that's gone. Be careful not to modify                                                // 858
        // self._published while iterating over it.                                                                   // 859
        var idsToRemove = [];                                                                                         // 860
        self._published.forEach(function (doc, id) {                                                                  // 861
          if (!newResults.has(id)) idsToRemove.push(id);                                                              // 862
        });                                                                                                           // 864
        _.each(idsToRemove, function (id) {                                                                           // 865
          self._removePublished(id);                                                                                  // 866
        });                                                                                                           // 867
                                                                                                                      //
        // Now do adds and changes.                                                                                   // 869
        // If self has a buffer and limit, the new fetched result will be                                             // 870
        // limited correctly as the query has sort specifier.                                                         // 871
        newResults.forEach(function (doc, id) {                                                                       // 872
          self._handleDoc(id, doc);                                                                                   // 873
        });                                                                                                           // 874
                                                                                                                      //
        // Sanity-check that everything we tried to put into _published ended up                                      // 876
        // there.                                                                                                     // 877
        // XXX if this is slow, remove it later                                                                       // 878
        if (self._published.size() !== newResults.size()) {                                                           // 879
          throw Error("The Mongo server and the Meteor query disagree on how " + "many documents match your query. Maybe it is hitting a Mongo " + "edge case? The query is: " + EJSON.stringify(self._cursorDescription.selector));
        }                                                                                                             // 885
        self._published.forEach(function (doc, id) {                                                                  // 886
          if (!newResults.has(id)) throw Error("_published has a doc that newResults doesn't; " + id);                // 887
        });                                                                                                           // 889
                                                                                                                      //
        // Finally, replace the buffer                                                                                // 891
        newBuffer.forEach(function (doc, id) {                                                                        // 892
          self._addBuffered(id, doc);                                                                                 // 893
        });                                                                                                           // 894
                                                                                                                      //
        self._safeAppendToBuffer = newBuffer.size() < self._limit;                                                    // 896
      });                                                                                                             // 897
    }                                                                                                                 // 898
                                                                                                                      //
    return _publishNewResults;                                                                                        // 848
  }(),                                                                                                                // 848
                                                                                                                      //
  // This stop function is invoked from the onStop of the ObserveMultiplexer, so                                      // 900
  // it shouldn't actually be possible to call it until the multiplexer is                                            // 901
  // ready.                                                                                                           // 902
  //                                                                                                                  // 903
  // It's important to check self._stopped after every call in this file that                                         // 904
  // can yield!                                                                                                       // 905
  stop: function () {                                                                                                 // 906
    function stop() {                                                                                                 // 906
      var self = this;                                                                                                // 907
      if (self._stopped) return;                                                                                      // 908
      self._stopped = true;                                                                                           // 910
      _.each(self._stopHandles, function (handle) {                                                                   // 911
        handle.stop();                                                                                                // 912
      });                                                                                                             // 913
                                                                                                                      //
      // Note: we *don't* use multiplexer.onFlush here because this stop                                              // 915
      // callback is actually invoked by the multiplexer itself when it has                                           // 916
      // determined that there are no handles left. So nothing is actually going                                      // 917
      // to get flushed (and it's probably not valid to call methods on the                                           // 918
      // dying multiplexer).                                                                                          // 919
      _.each(self._writesToCommitWhenWeReachSteady, function (w) {                                                    // 920
        w.committed(); // maybe yields?                                                                               // 921
      });                                                                                                             // 922
      self._writesToCommitWhenWeReachSteady = null;                                                                   // 923
                                                                                                                      //
      // Proactively drop references to potentially big things.                                                       // 925
      self._published = null;                                                                                         // 926
      self._unpublishedBuffer = null;                                                                                 // 927
      self._needToFetch = null;                                                                                       // 928
      self._currentlyFetching = null;                                                                                 // 929
      self._oplogEntryHandle = null;                                                                                  // 930
      self._listenersHandle = null;                                                                                   // 931
                                                                                                                      //
      Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "observe-drivers-oplog", -1);        // 933
    }                                                                                                                 // 935
                                                                                                                      //
    return stop;                                                                                                      // 906
  }(),                                                                                                                // 906
                                                                                                                      //
  _registerPhaseChange: function () {                                                                                 // 937
    function _registerPhaseChange(phase) {                                                                            // 937
      var self = this;                                                                                                // 938
      Meteor._noYieldsAllowed(function () {                                                                           // 939
        var now = new Date();                                                                                         // 940
                                                                                                                      //
        if (self._phase) {                                                                                            // 942
          var timeDiff = now - self._phaseStartTime;                                                                  // 943
          Package.facts && Package.facts.Facts.incrementServerFact("mongo-livedata", "time-spent-in-" + self._phase + "-phase", timeDiff);
        }                                                                                                             // 946
                                                                                                                      //
        self._phase = phase;                                                                                          // 948
        self._phaseStartTime = now;                                                                                   // 949
      });                                                                                                             // 950
    }                                                                                                                 // 951
                                                                                                                      //
    return _registerPhaseChange;                                                                                      // 937
  }()                                                                                                                 // 937
});                                                                                                                   // 196
                                                                                                                      //
// Does our oplog tailing code support this cursor? For now, we are being very                                        // 954
// conservative and allowing only simple queries with simple options.                                                 // 955
// (This is a "static method".)                                                                                       // 956
OplogObserveDriver.cursorSupported = function (cursorDescription, matcher) {                                          // 957
  // First, check the options.                                                                                        // 958
  var options = cursorDescription.options;                                                                            // 959
                                                                                                                      //
  // Did the user say no explicitly?                                                                                  // 961
  // underscored version of the option is COMPAT with 1.2                                                             // 962
  if (options.disableOplog || options._disableOplog) return false;                                                    // 963
                                                                                                                      //
  // skip is not supported: to support it we would need to keep track of all                                          // 966
  // "skipped" documents or at least their ids.                                                                       // 967
  // limit w/o a sort specifier is not supported: current implementation needs a                                      // 968
  // deterministic way to order documents.                                                                            // 969
  if (options.skip || options.limit && !options.sort) return false;                                                   // 970
                                                                                                                      //
  // If a fields projection option is given check if it is supported by                                               // 972
  // minimongo (some operators are not supported).                                                                    // 973
  if (options.fields) {                                                                                               // 974
    try {                                                                                                             // 975
      LocalCollection._checkSupportedProjection(options.fields);                                                      // 976
    } catch (e) {                                                                                                     // 977
      if (e.name === "MinimongoError") return false;else throw e;                                                     // 978
    }                                                                                                                 // 982
  }                                                                                                                   // 983
                                                                                                                      //
  // We don't allow the following selectors:                                                                          // 985
  //   - $where (not confident that we provide the same JS environment                                                // 986
  //             as Mongo, and can yield!)                                                                            // 987
  //   - $near (has "interesting" properties in MongoDB, like the possibility                                         // 988
  //            of returning an ID multiple times, though even polling maybe                                          // 989
  //            have a bug there)                                                                                     // 990
  //           XXX: once we support it, we would need to think more on how we                                         // 991
  //           initialize the comparators when we create the driver.                                                  // 992
  return !matcher.hasWhere() && !matcher.hasGeoQuery();                                                               // 993
};                                                                                                                    // 994
                                                                                                                      //
var modifierCanBeDirectlyApplied = function modifierCanBeDirectlyApplied(modifier) {                                  // 996
  return _.all(modifier, function (fields, operation) {                                                               // 997
    return _.all(fields, function (value, field) {                                                                    // 998
      return !/EJSON\$/.test(field);                                                                                  // 999
    });                                                                                                               // 1000
  });                                                                                                                 // 1001
};                                                                                                                    // 1002
                                                                                                                      //
MongoInternals.OplogObserveDriver = OplogObserveDriver;                                                               // 1004
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"local_collection_driver.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/local_collection_driver.js                                                                          //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
LocalCollectionDriver = function LocalCollectionDriver() {                                                            // 1
  var self = this;                                                                                                    // 2
  self.noConnCollections = {};                                                                                        // 3
};                                                                                                                    // 4
                                                                                                                      //
var ensureCollection = function ensureCollection(name, collections) {                                                 // 6
  if (!(name in collections)) collections[name] = new LocalCollection(name);                                          // 7
  return collections[name];                                                                                           // 9
};                                                                                                                    // 10
                                                                                                                      //
_.extend(LocalCollectionDriver.prototype, {                                                                           // 12
  open: function () {                                                                                                 // 13
    function open(name, conn) {                                                                                       // 13
      var self = this;                                                                                                // 14
      if (!name) return new LocalCollection();                                                                        // 15
      if (!conn) {                                                                                                    // 17
        return ensureCollection(name, self.noConnCollections);                                                        // 18
      }                                                                                                               // 19
      if (!conn._mongo_livedata_collections) conn._mongo_livedata_collections = {};                                   // 20
      // XXX is there a way to keep track of a connection's collections without                                       // 22
      // dangling it off the connection object?                                                                       // 23
      return ensureCollection(name, conn._mongo_livedata_collections);                                                // 24
    }                                                                                                                 // 25
                                                                                                                      //
    return open;                                                                                                      // 13
  }()                                                                                                                 // 13
});                                                                                                                   // 12
                                                                                                                      //
// singleton                                                                                                          // 28
LocalCollectionDriver = new LocalCollectionDriver();                                                                  // 29
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"remote_collection_driver.js":function(require){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/remote_collection_driver.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
MongoInternals.RemoteCollectionDriver = function (mongo_url, options) {                                               // 1
  var self = this;                                                                                                    // 3
  self.mongo = new MongoConnection(mongo_url, options);                                                               // 4
};                                                                                                                    // 5
                                                                                                                      //
_.extend(MongoInternals.RemoteCollectionDriver.prototype, {                                                           // 7
  open: function () {                                                                                                 // 8
    function open(name) {                                                                                             // 8
      var self = this;                                                                                                // 9
      var ret = {};                                                                                                   // 10
      _.each(['find', 'findOne', 'insert', 'update', 'upsert', 'remove', '_ensureIndex', '_dropIndex', '_createCappedCollection', 'dropCollection', 'rawCollection'], function (m) {
        ret[m] = _.bind(self.mongo[m], self.mongo, name);                                                             // 16
      });                                                                                                             // 17
      return ret;                                                                                                     // 18
    }                                                                                                                 // 19
                                                                                                                      //
    return open;                                                                                                      // 8
  }()                                                                                                                 // 8
});                                                                                                                   // 7
                                                                                                                      //
// Create the singleton RemoteCollectionDriver only on demand, so we                                                  // 23
// only require Mongo configuration if it's actually used (eg, not if                                                 // 24
// you're only trying to receive data from a remote DDP server.)                                                      // 25
MongoInternals.defaultRemoteCollectionDriver = _.once(function () {                                                   // 26
  var connectionOptions = {};                                                                                         // 27
                                                                                                                      //
  var mongoUrl = process.env.MONGO_URL;                                                                               // 29
                                                                                                                      //
  if (process.env.MONGO_OPLOG_URL) {                                                                                  // 31
    connectionOptions.oplogUrl = process.env.MONGO_OPLOG_URL;                                                         // 32
  }                                                                                                                   // 33
                                                                                                                      //
  if (!mongoUrl) throw new Error("MONGO_URL must be set in environment");                                             // 35
                                                                                                                      //
  return new MongoInternals.RemoteCollectionDriver(mongoUrl, connectionOptions);                                      // 38
});                                                                                                                   // 39
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"collection.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/collection.js                                                                                       //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
// options.connection, if given, is a LivedataClient or LivedataServer                                                // 1
// XXX presently there is no way to destroy/clean up a Collection                                                     // 2
                                                                                                                      //
/**                                                                                                                   // 4
 * @summary Namespace for MongoDB-related items                                                                       //
 * @namespace                                                                                                         //
 */                                                                                                                   //
Mongo = {};                                                                                                           // 8
                                                                                                                      //
/**                                                                                                                   // 10
 * @summary Constructor for a Collection                                                                              //
 * @locus Anywhere                                                                                                    //
 * @instancename collection                                                                                           //
 * @class                                                                                                             //
 * @param {String} name The name of the collection.  If null, creates an unmanaged (unsynchronized) local collection.
 * @param {Object} [options]                                                                                          //
 * @param {Object} options.connection The server connection that will manage this collection. Uses the default connection if not specified.  Pass the return value of calling [`DDP.connect`](#ddp_connect) to specify a different server. Pass `null` to specify no connection. Unmanaged (`name` is null) collections cannot specify a connection.
 * @param {String} options.idGeneration The method of generating the `_id` fields of new documents in this collection.  Possible values:
                                                                                                                      //
 - **`'STRING'`**: random strings                                                                                     //
 - **`'MONGO'`**:  random [`Mongo.ObjectID`](#mongo_object_id) values                                                 //
                                                                                                                      //
The default id generation technique is `'STRING'`.                                                                    //
 * @param {Function} options.transform An optional transformation function. Documents will be passed through this function before being returned from `fetch` or `findOne`, and before being passed to callbacks of `observe`, `map`, `forEach`, `allow`, and `deny`. Transforms are *not* applied for the callbacks of `observeChanges` or to cursors returned from publish functions.
 * @param {Boolean} options.defineMutationMethods Set to `false` to skip setting up the mutation methods that enable insert/update/remove from client code. Default `true`.
 */                                                                                                                   //
Mongo.Collection = function (name, options) {                                                                         // 27
  var self = this;                                                                                                    // 28
  if (!(self instanceof Mongo.Collection)) throw new Error('use "new" to construct a Mongo.Collection');              // 29
                                                                                                                      //
  if (!name && name !== null) {                                                                                       // 32
    Meteor._debug("Warning: creating anonymous collection. It will not be " + "saved or synchronized over the network. (Pass null for " + "the collection name to turn off this warning.)");
    name = null;                                                                                                      // 36
  }                                                                                                                   // 37
                                                                                                                      //
  if (name !== null && typeof name !== "string") {                                                                    // 39
    throw new Error("First argument to new Mongo.Collection must be a string or null");                               // 40
  }                                                                                                                   // 42
                                                                                                                      //
  if (options && options.methods) {                                                                                   // 44
    // Backwards compatibility hack with original signature (which passed                                             // 45
    // "connection" directly instead of in options. (Connections must have a "methods"                                // 46
    // method.)                                                                                                       // 47
    // XXX remove before 1.0                                                                                          // 48
    options = { connection: options };                                                                                // 49
  }                                                                                                                   // 50
  // Backwards compatibility: "connection" used to be called "manager".                                               // 51
  if (options && options.manager && !options.connection) {                                                            // 52
    options.connection = options.manager;                                                                             // 53
  }                                                                                                                   // 54
  options = _.extend({                                                                                                // 55
    connection: undefined,                                                                                            // 56
    idGeneration: 'STRING',                                                                                           // 57
    transform: null,                                                                                                  // 58
    _driver: undefined,                                                                                               // 59
    _preventAutopublish: false                                                                                        // 60
  }, options);                                                                                                        // 55
                                                                                                                      //
  switch (options.idGeneration) {                                                                                     // 63
    case 'MONGO':                                                                                                     // 64
      self._makeNewID = function () {                                                                                 // 65
        var src = name ? DDP.randomStream('/collection/' + name) : Random.insecure;                                   // 66
        return new Mongo.ObjectID(src.hexString(24));                                                                 // 69
      };                                                                                                              // 70
      break;                                                                                                          // 71
    case 'STRING':                                                                                                    // 72
    default:                                                                                                          // 73
      self._makeNewID = function () {                                                                                 // 74
        var src = name ? DDP.randomStream('/collection/' + name) : Random.insecure;                                   // 75
        return src.id();                                                                                              // 78
      };                                                                                                              // 79
      break;                                                                                                          // 80
  }                                                                                                                   // 63
                                                                                                                      //
  self._transform = LocalCollection.wrapTransform(options.transform);                                                 // 83
                                                                                                                      //
  if (!name || options.connection === null)                                                                           // 85
    // note: nameless collections never have a connection                                                             // 86
    self._connection = null;else if (options.connection) self._connection = options.connection;else if (Meteor.isClient) self._connection = Meteor.connection;else self._connection = Meteor.server;
                                                                                                                      //
  if (!options._driver) {                                                                                             // 95
    // XXX This check assumes that webapp is loaded so that Meteor.server !==                                         // 96
    // null. We should fully support the case of "want to use a Mongo-backed                                          // 97
    // collection from Node code without webapp", but we don't yet.                                                   // 98
    // #MeteorServerNull                                                                                              // 99
    if (name && self._connection === Meteor.server && typeof MongoInternals !== "undefined" && MongoInternals.defaultRemoteCollectionDriver) {
      options._driver = MongoInternals.defaultRemoteCollectionDriver();                                               // 103
    } else {                                                                                                          // 104
      options._driver = LocalCollectionDriver;                                                                        // 105
    }                                                                                                                 // 106
  }                                                                                                                   // 107
                                                                                                                      //
  self._collection = options._driver.open(name, self._connection);                                                    // 109
  self._name = name;                                                                                                  // 110
  self._driver = options._driver;                                                                                     // 111
                                                                                                                      //
  if (self._connection && self._connection.registerStore) {                                                           // 113
    // OK, we're going to be a slave, replicating some remote                                                         // 114
    // database, except possibly with some temporary divergence while                                                 // 115
    // we have unacknowledged RPC's.                                                                                  // 116
    var ok = self._connection.registerStore(name, {                                                                   // 117
      // Called at the beginning of a batch of updates. batchSize is the number                                       // 118
      // of update calls to expect.                                                                                   // 119
      //                                                                                                              // 120
      // XXX This interface is pretty janky. reset probably ought to go back to                                       // 121
      // being its own function, and callers shouldn't have to calculate                                              // 122
      // batchSize. The optimization of not calling pause/remove should be                                            // 123
      // delayed until later: the first call to update() should buffer its                                            // 124
      // message, and then we can either directly apply it at endUpdate time if                                       // 125
      // it was the only update, or do pauseObservers/apply/apply at the next                                         // 126
      // update() if there's another one.                                                                             // 127
      beginUpdate: function () {                                                                                      // 128
        function beginUpdate(batchSize, reset) {                                                                      // 128
          // pause observers so users don't see flicker when updating several                                         // 129
          // objects at once (including the post-reconnect reset-and-reapply                                          // 130
          // stage), and so that a re-sorting of a query can take advantage of the                                    // 131
          // full _diffQuery moved calculation instead of applying change one at a                                    // 132
          // time.                                                                                                    // 133
          if (batchSize > 1 || reset) self._collection.pauseObservers();                                              // 134
                                                                                                                      //
          if (reset) self._collection.remove({});                                                                     // 137
        }                                                                                                             // 139
                                                                                                                      //
        return beginUpdate;                                                                                           // 128
      }(),                                                                                                            // 128
                                                                                                                      //
      // Apply an update.                                                                                             // 141
      // XXX better specify this interface (not in terms of a wire message)?                                          // 142
      update: function () {                                                                                           // 143
        function update(msg) {                                                                                        // 143
          var mongoId = MongoID.idParse(msg.id);                                                                      // 144
          var doc = self._collection.findOne(mongoId);                                                                // 145
                                                                                                                      //
          // Is this a "replace the whole doc" message coming from the quiescence                                     // 147
          // of method writes to an object? (Note that 'undefined' is a valid                                         // 148
          // value meaning "remove it".)                                                                              // 149
          if (msg.msg === 'replace') {                                                                                // 150
            var replace = msg.replace;                                                                                // 151
            if (!replace) {                                                                                           // 152
              if (doc) self._collection.remove(mongoId);                                                              // 153
            } else if (!doc) {                                                                                        // 155
              self._collection.insert(replace);                                                                       // 156
            } else {                                                                                                  // 157
              // XXX check that replace has no $ ops                                                                  // 158
              self._collection.update(mongoId, replace);                                                              // 159
            }                                                                                                         // 160
            return;                                                                                                   // 161
          } else if (msg.msg === 'added') {                                                                           // 162
            if (doc) {                                                                                                // 163
              throw new Error("Expected not to find a document already present for an add");                          // 164
            }                                                                                                         // 165
            self._collection.insert(_.extend({ _id: mongoId }, msg.fields));                                          // 166
          } else if (msg.msg === 'removed') {                                                                         // 167
            if (!doc) throw new Error("Expected to find a document already present for removed");                     // 168
            self._collection.remove(mongoId);                                                                         // 170
          } else if (msg.msg === 'changed') {                                                                         // 171
            if (!doc) throw new Error("Expected to find a document to change");                                       // 172
            if (!_.isEmpty(msg.fields)) {                                                                             // 174
              var modifier = {};                                                                                      // 175
              _.each(msg.fields, function (value, key) {                                                              // 176
                if (value === undefined) {                                                                            // 177
                  if (!modifier.$unset) modifier.$unset = {};                                                         // 178
                  modifier.$unset[key] = 1;                                                                           // 180
                } else {                                                                                              // 181
                  if (!modifier.$set) modifier.$set = {};                                                             // 182
                  modifier.$set[key] = value;                                                                         // 184
                }                                                                                                     // 185
              });                                                                                                     // 186
              self._collection.update(mongoId, modifier);                                                             // 187
            }                                                                                                         // 188
          } else {                                                                                                    // 189
            throw new Error("I don't know how to deal with this message");                                            // 190
          }                                                                                                           // 191
        }                                                                                                             // 193
                                                                                                                      //
        return update;                                                                                                // 143
      }(),                                                                                                            // 143
                                                                                                                      //
      // Called at the end of a batch of updates.                                                                     // 195
      endUpdate: function () {                                                                                        // 196
        function endUpdate() {                                                                                        // 196
          self._collection.resumeObservers();                                                                         // 197
        }                                                                                                             // 198
                                                                                                                      //
        return endUpdate;                                                                                             // 196
      }(),                                                                                                            // 196
                                                                                                                      //
      // Called around method stub invocations to capture the original versions                                       // 200
      // of modified documents.                                                                                       // 201
      saveOriginals: function () {                                                                                    // 202
        function saveOriginals() {                                                                                    // 202
          self._collection.saveOriginals();                                                                           // 203
        }                                                                                                             // 204
                                                                                                                      //
        return saveOriginals;                                                                                         // 202
      }(),                                                                                                            // 202
      retrieveOriginals: function () {                                                                                // 205
        function retrieveOriginals() {                                                                                // 205
          return self._collection.retrieveOriginals();                                                                // 206
        }                                                                                                             // 207
                                                                                                                      //
        return retrieveOriginals;                                                                                     // 205
      }(),                                                                                                            // 205
                                                                                                                      //
      // Used to preserve current versions of documents across a store reset.                                         // 209
      getDoc: function () {                                                                                           // 210
        function getDoc(id) {                                                                                         // 210
          return self.findOne(id);                                                                                    // 211
        }                                                                                                             // 212
                                                                                                                      //
        return getDoc;                                                                                                // 210
      }(),                                                                                                            // 210
                                                                                                                      //
      // To be able to get back to the collection from the store.                                                     // 214
      _getCollection: function () {                                                                                   // 215
        function _getCollection() {                                                                                   // 215
          return self;                                                                                                // 216
        }                                                                                                             // 217
                                                                                                                      //
        return _getCollection;                                                                                        // 215
      }()                                                                                                             // 215
    });                                                                                                               // 117
                                                                                                                      //
    if (!ok) {                                                                                                        // 220
      var message = "There is already a collection named \"" + name + "\"";                                           // 221
      if (options._suppressSameNameError === true) {                                                                  // 222
        // XXX In theory we do not have to throw when `ok` is falsy. The store is already defined                     // 223
        // for this collection name, but this will simply be another reference to it and everything                   // 224
        // should work. However, we have historically thrown an error here, so for now we will                        // 225
        // skip the error only when `_suppressSameNameError` is `true`, allowing people to opt in                     // 226
        // and give this some real world testing.                                                                     // 227
        console.warn ? console.warn(message) : console.log(message);                                                  // 228
      } else {                                                                                                        // 229
        throw new Error(message);                                                                                     // 230
      }                                                                                                               // 231
    }                                                                                                                 // 232
  }                                                                                                                   // 233
                                                                                                                      //
  // XXX don't define these until allow or deny is actually used for this                                             // 235
  // collection. Could be hard if the security rules are only defined on the                                          // 236
  // server.                                                                                                          // 237
  if (options.defineMutationMethods !== false) {                                                                      // 238
    try {                                                                                                             // 239
      self._defineMutationMethods({ useExisting: options._suppressSameNameError === true });                          // 240
    } catch (error) {                                                                                                 // 241
      // Throw a more understandable error on the server for same collection name                                     // 242
      if (error.message === "A method named '/" + name + "/insert' is already defined") throw new Error("There is already a collection named \"" + name + "\"");
      throw error;                                                                                                    // 245
    }                                                                                                                 // 246
  }                                                                                                                   // 247
                                                                                                                      //
  // autopublish                                                                                                      // 249
  if (Package.autopublish && !options._preventAutopublish && self._connection && self._connection.publish) {          // 250
    self._connection.publish(null, function () {                                                                      // 252
      return self.find();                                                                                             // 253
    }, { is_auto: true });                                                                                            // 254
  }                                                                                                                   // 255
};                                                                                                                    // 256
                                                                                                                      //
///                                                                                                                   // 258
/// Main collection API                                                                                               // 259
///                                                                                                                   // 260
                                                                                                                      //
                                                                                                                      //
_.extend(Mongo.Collection.prototype, {                                                                                // 263
                                                                                                                      //
  _getFindSelector: function () {                                                                                     // 265
    function _getFindSelector(args) {                                                                                 // 265
      if (args.length == 0) return {};else return args[0];                                                            // 266
    }                                                                                                                 // 270
                                                                                                                      //
    return _getFindSelector;                                                                                          // 265
  }(),                                                                                                                // 265
                                                                                                                      //
  _getFindOptions: function () {                                                                                      // 272
    function _getFindOptions(args) {                                                                                  // 272
      var self = this;                                                                                                // 273
      if (args.length < 2) {                                                                                          // 274
        return { transform: self._transform };                                                                        // 275
      } else {                                                                                                        // 276
        check(args[1], Match.Optional(Match.ObjectIncluding({                                                         // 277
          fields: Match.Optional(Match.OneOf(Object, undefined)),                                                     // 278
          sort: Match.Optional(Match.OneOf(Object, Array, Function, undefined)),                                      // 279
          limit: Match.Optional(Match.OneOf(Number, undefined)),                                                      // 280
          skip: Match.Optional(Match.OneOf(Number, undefined))                                                        // 281
        })));                                                                                                         // 277
                                                                                                                      //
        return _.extend({                                                                                             // 284
          transform: self._transform                                                                                  // 285
        }, args[1]);                                                                                                  // 284
      }                                                                                                               // 287
    }                                                                                                                 // 288
                                                                                                                      //
    return _getFindOptions;                                                                                           // 272
  }(),                                                                                                                // 272
                                                                                                                      //
  /**                                                                                                                 // 290
   * @summary Find the documents in a collection that match the selector.                                             //
   * @locus Anywhere                                                                                                  //
   * @method find                                                                                                     //
   * @memberOf Mongo.Collection                                                                                       //
   * @instance                                                                                                        //
   * @param {MongoSelector} [selector] A query describing the documents to find                                       //
   * @param {Object} [options]                                                                                        //
   * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)                                     //
   * @param {Number} options.skip Number of results to skip at the beginning                                          //
   * @param {Number} options.limit Maximum number of results to return                                                //
   * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.                           //
   * @param {Boolean} options.reactive (Client only) Default `true`; pass `false` to disable reactivity               //
   * @param {Function} options.transform Overrides `transform` on the  [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
   * @param {Boolean} options.disableOplog (Server only) Pass true to disable oplog-tailing on this query. This affects the way server processes calls to `observe` on this query. Disabling the oplog can be useful when working with data that updates in large batches.
   * @param {Number} options.pollingIntervalMs (Server only) When oplog is disabled (through the use of `disableOplog` or when otherwise not available), the frequency (in milliseconds) of how often to poll this query when observing on the server. Defaults to 10000ms (10 seconds).
   * @param {Number} options.pollingThrottleMs (Server only) When oplog is disabled (through the use of `disableOplog` or when otherwise not available), the minimum time (in milliseconds) to allow between re-polling when observing on the server. Increasing this will save CPU and mongo load at the expense of slower updates to users. Decreasing this is not recommended. Defaults to 50ms.
   * @returns {Mongo.Cursor}                                                                                          //
   */                                                                                                                 //
  find: function () {                                                                                                 // 309
    function find() /* selector, options */{                                                                          // 309
      // Collection.find() (return all docs) behaves differently                                                      // 310
      // from Collection.find(undefined) (return 0 docs).  so be                                                      // 311
      // careful about the length of arguments.                                                                       // 312
      var self = this;                                                                                                // 313
      var argArray = _.toArray(arguments);                                                                            // 314
      return self._collection.find(self._getFindSelector(argArray), self._getFindOptions(argArray));                  // 315
    }                                                                                                                 // 317
                                                                                                                      //
    return find;                                                                                                      // 309
  }(),                                                                                                                // 309
                                                                                                                      //
  /**                                                                                                                 // 319
   * @summary Finds the first document that matches the selector, as ordered by sort and skip options. Returns `undefined` if no matching document is found.
   * @locus Anywhere                                                                                                  //
   * @method findOne                                                                                                  //
   * @memberOf Mongo.Collection                                                                                       //
   * @instance                                                                                                        //
   * @param {MongoSelector} [selector] A query describing the documents to find                                       //
   * @param {Object} [options]                                                                                        //
   * @param {MongoSortSpecifier} options.sort Sort order (default: natural order)                                     //
   * @param {Number} options.skip Number of results to skip at the beginning                                          //
   * @param {MongoFieldSpecifier} options.fields Dictionary of fields to return or exclude.                           //
   * @param {Boolean} options.reactive (Client only) Default true; pass false to disable reactivity                   //
   * @param {Function} options.transform Overrides `transform` on the [`Collection`](#collections) for this cursor.  Pass `null` to disable transformation.
   * @returns {Object}                                                                                                //
   */                                                                                                                 //
  findOne: function () {                                                                                              // 334
    function findOne() /* selector, options */{                                                                       // 334
      var self = this;                                                                                                // 335
      var argArray = _.toArray(arguments);                                                                            // 336
      return self._collection.findOne(self._getFindSelector(argArray), self._getFindOptions(argArray));               // 337
    }                                                                                                                 // 339
                                                                                                                      //
    return findOne;                                                                                                   // 334
  }()                                                                                                                 // 334
                                                                                                                      //
});                                                                                                                   // 263
                                                                                                                      //
Mongo.Collection._publishCursor = function (cursor, sub, collection) {                                                // 343
  var observeHandle = cursor.observeChanges({                                                                         // 344
    added: function () {                                                                                              // 345
      function added(id, fields) {                                                                                    // 345
        sub.added(collection, id, fields);                                                                            // 346
      }                                                                                                               // 347
                                                                                                                      //
      return added;                                                                                                   // 345
    }(),                                                                                                              // 345
    changed: function () {                                                                                            // 348
      function changed(id, fields) {                                                                                  // 348
        sub.changed(collection, id, fields);                                                                          // 349
      }                                                                                                               // 350
                                                                                                                      //
      return changed;                                                                                                 // 348
    }(),                                                                                                              // 348
    removed: function () {                                                                                            // 351
      function removed(id) {                                                                                          // 351
        sub.removed(collection, id);                                                                                  // 352
      }                                                                                                               // 353
                                                                                                                      //
      return removed;                                                                                                 // 351
    }()                                                                                                               // 351
  });                                                                                                                 // 344
                                                                                                                      //
  // We don't call sub.ready() here: it gets called in livedata_server, after                                         // 356
  // possibly calling _publishCursor on multiple returned cursors.                                                    // 357
                                                                                                                      //
  // register stop callback (expects lambda w/ no args).                                                              // 359
  sub.onStop(function () {                                                                                            // 360
    observeHandle.stop();                                                                                             // 360
  });                                                                                                                 // 360
                                                                                                                      //
  // return the observeHandle in case it needs to be stopped early                                                    // 362
  return observeHandle;                                                                                               // 363
};                                                                                                                    // 364
                                                                                                                      //
// protect against dangerous selectors.  falsey and {_id: falsey} are both                                            // 366
// likely programmer error, and not what you want, particularly for destructive                                       // 367
// operations.  JS regexps don't serialize over DDP but can be trivially                                              // 368
// replaced by $regex.                                                                                                // 369
Mongo.Collection._rewriteSelector = function (selector) {                                                             // 370
  // shorthand -- scalars match _id                                                                                   // 371
  if (LocalCollection._selectorIsId(selector)) selector = { _id: selector };                                          // 372
                                                                                                                      //
  if (_.isArray(selector)) {                                                                                          // 375
    // This is consistent with the Mongo console itself; if we don't do this                                          // 376
    // check passing an empty array ends up selecting all items                                                       // 377
    throw new Error("Mongo selector can't be an array.");                                                             // 378
  }                                                                                                                   // 379
                                                                                                                      //
  if (!selector || '_id' in selector && !selector._id)                                                                // 381
    // can't match anything                                                                                           // 382
    return { _id: Random.id() };                                                                                      // 383
                                                                                                                      //
  var ret = {};                                                                                                       // 385
  _.each(selector, function (value, key) {                                                                            // 386
    // Mongo supports both {field: /foo/} and {field: {$regex: /foo/}}                                                // 387
    if (value instanceof RegExp) {                                                                                    // 388
      ret[key] = convertRegexpToMongoSelector(value);                                                                 // 389
    } else if (value && value.$regex instanceof RegExp) {                                                             // 390
      ret[key] = convertRegexpToMongoSelector(value.$regex);                                                          // 391
      // if value is {$regex: /foo/, $options: ...} then $options                                                     // 392
      // override the ones set on $regex.                                                                             // 393
      if (value.$options !== undefined) ret[key].$options = value.$options;                                           // 394
    } else if (_.contains(['$or', '$and', '$nor'], key)) {                                                            // 396
      // Translate lower levels of $and/$or/$nor                                                                      // 398
      ret[key] = _.map(value, function (v) {                                                                          // 399
        return Mongo.Collection._rewriteSelector(v);                                                                  // 400
      });                                                                                                             // 401
    } else {                                                                                                          // 402
      ret[key] = value;                                                                                               // 403
    }                                                                                                                 // 404
  });                                                                                                                 // 405
  return ret;                                                                                                         // 406
};                                                                                                                    // 407
                                                                                                                      //
// convert a JS RegExp object to a Mongo {$regex: ..., $options: ...}                                                 // 409
// selector                                                                                                           // 410
function convertRegexpToMongoSelector(regexp) {                                                                       // 411
  check(regexp, RegExp); // safety belt                                                                               // 412
                                                                                                                      //
  var selector = { $regex: regexp.source };                                                                           // 414
  var regexOptions = '';                                                                                              // 415
  // JS RegExp objects support 'i', 'm', and 'g'. Mongo regex $options                                                // 416
  // support 'i', 'm', 'x', and 's'. So we support 'i' and 'm' here.                                                  // 417
  if (regexp.ignoreCase) regexOptions += 'i';                                                                         // 418
  if (regexp.multiline) regexOptions += 'm';                                                                          // 420
  if (regexOptions) selector.$options = regexOptions;                                                                 // 422
                                                                                                                      //
  return selector;                                                                                                    // 425
};                                                                                                                    // 426
                                                                                                                      //
// 'insert' immediately returns the inserted document's new _id.                                                      // 428
// The others return values immediately if you are in a stub, an in-memory                                            // 429
// unmanaged collection, or a mongo-backed collection and you don't pass a                                            // 430
// callback. 'update' and 'remove' return the number of affected                                                      // 431
// documents. 'upsert' returns an object with keys 'numberAffected' and, if an                                        // 432
// insert happened, 'insertedId'.                                                                                     // 433
//                                                                                                                    // 434
// Otherwise, the semantics are exactly like other methods: they take                                                 // 435
// a callback as an optional last argument; if no callback is                                                         // 436
// provided, they block until the operation is complete, and throw an                                                 // 437
// exception if it fails; if a callback is provided, then they don't                                                  // 438
// necessarily block, and they call the callback when they finish with error and                                      // 439
// result arguments.  (The insert method provides the document ID as its result;                                      // 440
// update and remove provide the number of affected docs as the result; upsert                                        // 441
// provides an object with numberAffected and maybe insertedId.)                                                      // 442
//                                                                                                                    // 443
// On the client, blocking is impossible, so if a callback                                                            // 444
// isn't provided, they just return immediately and any error                                                         // 445
// information is lost.                                                                                               // 446
//                                                                                                                    // 447
// There's one more tweak. On the client, if you don't provide a                                                      // 448
// callback, then if there is an error, a message will be logged with                                                 // 449
// Meteor._debug.                                                                                                     // 450
//                                                                                                                    // 451
// The intent (though this is actually determined by the underlying                                                   // 452
// drivers) is that the operations should be done synchronously, not                                                  // 453
// generating their result until the database has acknowledged                                                        // 454
// them. In the future maybe we should provide a flag to turn this                                                    // 455
// off.                                                                                                               // 456
                                                                                                                      //
/**                                                                                                                   // 458
 * @summary Insert a document in the collection.  Returns its unique _id.                                             //
 * @locus Anywhere                                                                                                    //
 * @method  insert                                                                                                    //
 * @memberOf Mongo.Collection                                                                                         //
 * @instance                                                                                                          //
 * @param {Object} doc The document to insert. May not yet have an _id attribute, in which case Meteor will generate one for you.
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the _id as the second.
 */                                                                                                                   //
Mongo.Collection.prototype.insert = function () {                                                                     // 467
  function insert(doc, callback) {                                                                                    // 467
    // Make sure we were passed a document to insert                                                                  // 468
    if (!doc) {                                                                                                       // 469
      throw new Error("insert requires an argument");                                                                 // 470
    }                                                                                                                 // 471
                                                                                                                      //
    // Shallow-copy the document and possibly generate an ID                                                          // 473
    doc = _.extend({}, doc);                                                                                          // 474
                                                                                                                      //
    if ('_id' in doc) {                                                                                               // 476
      if (!doc._id || !(typeof doc._id === 'string' || doc._id instanceof Mongo.ObjectID)) {                          // 477
        throw new Error("Meteor requires document _id fields to be non-empty strings or ObjectIDs");                  // 479
      }                                                                                                               // 480
    } else {                                                                                                          // 481
      var generateId = true;                                                                                          // 482
                                                                                                                      //
      // Don't generate the id if we're the client and the 'outermost' call                                           // 484
      // This optimization saves us passing both the randomSeed and the id                                            // 485
      // Passing both is redundant.                                                                                   // 486
      if (this._isRemoteCollection()) {                                                                               // 487
        var enclosing = DDP._CurrentInvocation.get();                                                                 // 488
        if (!enclosing) {                                                                                             // 489
          generateId = false;                                                                                         // 490
        }                                                                                                             // 491
      }                                                                                                               // 492
                                                                                                                      //
      if (generateId) {                                                                                               // 494
        doc._id = this._makeNewID();                                                                                  // 495
      }                                                                                                               // 496
    }                                                                                                                 // 497
                                                                                                                      //
    // On inserts, always return the id that we generated; on all other                                               // 499
    // operations, just return the result from the collection.                                                        // 500
    var chooseReturnValueFromCollectionResult = function () {                                                         // 501
      function chooseReturnValueFromCollectionResult(result) {                                                        // 501
        if (doc._id) {                                                                                                // 502
          return doc._id;                                                                                             // 503
        }                                                                                                             // 504
                                                                                                                      //
        // XXX what is this for??                                                                                     // 506
        // It's some iteraction between the callback to _callMutatorMethod and                                        // 507
        // the return value conversion                                                                                // 508
        doc._id = result;                                                                                             // 509
                                                                                                                      //
        return result;                                                                                                // 511
      }                                                                                                               // 512
                                                                                                                      //
      return chooseReturnValueFromCollectionResult;                                                                   // 501
    }();                                                                                                              // 501
                                                                                                                      //
    var wrappedCallback = wrapCallback(callback, chooseReturnValueFromCollectionResult);                              // 514
                                                                                                                      //
    if (this._isRemoteCollection()) {                                                                                 // 517
      var result = this._callMutatorMethod("insert", [doc], wrappedCallback);                                         // 518
      return chooseReturnValueFromCollectionResult(result);                                                           // 519
    }                                                                                                                 // 520
                                                                                                                      //
    // it's my collection.  descend into the collection object                                                        // 522
    // and propagate any exception.                                                                                   // 523
    try {                                                                                                             // 524
      // If the user provided a callback and the collection implements this                                           // 525
      // operation asynchronously, then queryRet will be undefined, and the                                           // 526
      // result will be returned through the callback instead.                                                        // 527
      var _result = this._collection.insert(doc, wrappedCallback);                                                    // 528
      return chooseReturnValueFromCollectionResult(_result);                                                          // 529
    } catch (e) {                                                                                                     // 530
      if (callback) {                                                                                                 // 531
        callback(e);                                                                                                  // 532
        return null;                                                                                                  // 533
      }                                                                                                               // 534
      throw e;                                                                                                        // 535
    }                                                                                                                 // 536
  }                                                                                                                   // 537
                                                                                                                      //
  return insert;                                                                                                      // 467
}();                                                                                                                  // 467
                                                                                                                      //
/**                                                                                                                   // 539
 * @summary Modify one or more documents in the collection. Returns the number of matched documents.                  //
 * @locus Anywhere                                                                                                    //
 * @method update                                                                                                     //
 * @memberOf Mongo.Collection                                                                                         //
 * @instance                                                                                                          //
 * @param {MongoSelector} selector Specifies which documents to modify                                                //
 * @param {MongoModifier} modifier Specifies how to modify the documents                                              //
 * @param {Object} [options]                                                                                          //
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Boolean} options.upsert True to insert a document if no matching documents are found.                      //
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 */                                                                                                                   //
Mongo.Collection.prototype.update = function () {                                                                     // 552
  function update(selector, modifier) {                                                                               // 552
    for (var _len = arguments.length, optionsAndCallback = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      optionsAndCallback[_key - 2] = arguments[_key];                                                                 // 552
    }                                                                                                                 // 552
                                                                                                                      //
    var callback = popCallbackFromArgs(optionsAndCallback);                                                           // 553
                                                                                                                      //
    selector = Mongo.Collection._rewriteSelector(selector);                                                           // 555
                                                                                                                      //
    // We've already popped off the callback, so we are left with an array                                            // 557
    // of one or zero items                                                                                           // 558
    var options = _.clone(optionsAndCallback[0]) || {};                                                               // 559
    if (options && options.upsert) {                                                                                  // 560
      // set `insertedId` if absent.  `insertedId` is a Meteor extension.                                             // 561
      if (options.insertedId) {                                                                                       // 562
        if (!(typeof options.insertedId === 'string' || options.insertedId instanceof Mongo.ObjectID)) throw new Error("insertedId must be string or ObjectID");
      } else if (!selector._id) {                                                                                     // 566
        options.insertedId = this._makeNewID();                                                                       // 567
      }                                                                                                               // 568
    }                                                                                                                 // 569
                                                                                                                      //
    var wrappedCallback = wrapCallback(callback);                                                                     // 571
                                                                                                                      //
    if (this._isRemoteCollection()) {                                                                                 // 573
      var args = [selector, modifier, options];                                                                       // 574
                                                                                                                      //
      return this._callMutatorMethod("update", args, wrappedCallback);                                                // 580
    }                                                                                                                 // 581
                                                                                                                      //
    // it's my collection.  descend into the collection object                                                        // 583
    // and propagate any exception.                                                                                   // 584
    try {                                                                                                             // 585
      // If the user provided a callback and the collection implements this                                           // 586
      // operation asynchronously, then queryRet will be undefined, and the                                           // 587
      // result will be returned through the callback instead.                                                        // 588
      return this._collection.update(selector, modifier, options, wrappedCallback);                                   // 589
    } catch (e) {                                                                                                     // 591
      if (callback) {                                                                                                 // 592
        callback(e);                                                                                                  // 593
        return null;                                                                                                  // 594
      }                                                                                                               // 595
      throw e;                                                                                                        // 596
    }                                                                                                                 // 597
  }                                                                                                                   // 598
                                                                                                                      //
  return update;                                                                                                      // 552
}();                                                                                                                  // 552
                                                                                                                      //
/**                                                                                                                   // 600
 * @summary Remove documents from the collection                                                                      //
 * @locus Anywhere                                                                                                    //
 * @method remove                                                                                                     //
 * @memberOf Mongo.Collection                                                                                         //
 * @instance                                                                                                          //
 * @param {MongoSelector} selector Specifies which documents to remove                                                //
 * @param {Function} [callback] Optional.  If present, called with an error object as its argument.                   //
 */                                                                                                                   //
Mongo.Collection.prototype.remove = function () {                                                                     // 609
  function remove(selector, callback) {                                                                               // 609
    selector = Mongo.Collection._rewriteSelector(selector);                                                           // 610
                                                                                                                      //
    var wrappedCallback = wrapCallback(callback);                                                                     // 612
                                                                                                                      //
    if (this._isRemoteCollection()) {                                                                                 // 614
      return this._callMutatorMethod("remove", [selector], wrappedCallback);                                          // 615
    }                                                                                                                 // 616
                                                                                                                      //
    // it's my collection.  descend into the collection object                                                        // 618
    // and propagate any exception.                                                                                   // 619
    try {                                                                                                             // 620
      // If the user provided a callback and the collection implements this                                           // 621
      // operation asynchronously, then queryRet will be undefined, and the                                           // 622
      // result will be returned through the callback instead.                                                        // 623
      return this._collection.remove(selector, wrappedCallback);                                                      // 624
    } catch (e) {                                                                                                     // 625
      if (callback) {                                                                                                 // 626
        callback(e);                                                                                                  // 627
        return null;                                                                                                  // 628
      }                                                                                                               // 629
      throw e;                                                                                                        // 630
    }                                                                                                                 // 631
  }                                                                                                                   // 632
                                                                                                                      //
  return remove;                                                                                                      // 609
}();                                                                                                                  // 609
                                                                                                                      //
// Determine if this collection is simply a minimongo representation of a real                                        // 634
// database on another server                                                                                         // 635
Mongo.Collection.prototype._isRemoteCollection = function () {                                                        // 636
  function _isRemoteCollection() {                                                                                    // 636
    // XXX see #MeteorServerNull                                                                                      // 637
    return this._connection && this._connection !== Meteor.server;                                                    // 638
  }                                                                                                                   // 639
                                                                                                                      //
  return _isRemoteCollection;                                                                                         // 636
}();                                                                                                                  // 636
                                                                                                                      //
// Convert the callback to not return a result if there is an error                                                   // 641
function wrapCallback(callback, convertResult) {                                                                      // 642
  if (!callback) {                                                                                                    // 643
    return;                                                                                                           // 644
  }                                                                                                                   // 645
                                                                                                                      //
  // If no convert function was passed in, just use a "blank function"                                                // 647
  convertResult = convertResult || _.identity;                                                                        // 648
                                                                                                                      //
  return function (error, result) {                                                                                   // 650
    callback(error, !error && convertResult(result));                                                                 // 651
  };                                                                                                                  // 652
}                                                                                                                     // 653
                                                                                                                      //
/**                                                                                                                   // 655
 * @summary Modify one or more documents in the collection, or insert one if no matching documents were found. Returns an object with keys `numberAffected` (the number of documents modified)  and `insertedId` (the unique _id of the document that was inserted, if any).
 * @locus Anywhere                                                                                                    //
 * @param {MongoSelector} selector Specifies which documents to modify                                                //
 * @param {MongoModifier} modifier Specifies how to modify the documents                                              //
 * @param {Object} [options]                                                                                          //
 * @param {Boolean} options.multi True to modify all matching documents; false to only modify one of the matching documents (the default).
 * @param {Function} [callback] Optional.  If present, called with an error object as the first argument and, if no error, the number of affected documents as the second.
 */                                                                                                                   //
Mongo.Collection.prototype.upsert = function () {                                                                     // 664
  function upsert(selector, modifier, options, callback) {                                                            // 664
    if (!callback && typeof options === "function") {                                                                 // 666
      callback = options;                                                                                             // 667
      options = {};                                                                                                   // 668
    }                                                                                                                 // 669
                                                                                                                      //
    var updateOptions = _.extend({}, options, {                                                                       // 671
      _returnObject: true,                                                                                            // 672
      upsert: true                                                                                                    // 673
    });                                                                                                               // 671
                                                                                                                      //
    return this.update(selector, modifier, updateOptions, callback);                                                  // 676
  }                                                                                                                   // 677
                                                                                                                      //
  return upsert;                                                                                                      // 664
}();                                                                                                                  // 664
                                                                                                                      //
// We'll actually design an index API later. For now, we just pass through to                                         // 679
// Mongo's, but make it synchronous.                                                                                  // 680
Mongo.Collection.prototype._ensureIndex = function (index, options) {                                                 // 681
  var self = this;                                                                                                    // 682
  if (!self._collection._ensureIndex) throw new Error("Can only call _ensureIndex on server collections");            // 683
  self._collection._ensureIndex(index, options);                                                                      // 685
};                                                                                                                    // 686
Mongo.Collection.prototype._dropIndex = function (index) {                                                            // 687
  var self = this;                                                                                                    // 688
  if (!self._collection._dropIndex) throw new Error("Can only call _dropIndex on server collections");                // 689
  self._collection._dropIndex(index);                                                                                 // 691
};                                                                                                                    // 692
Mongo.Collection.prototype._dropCollection = function () {                                                            // 693
  var self = this;                                                                                                    // 694
  if (!self._collection.dropCollection) throw new Error("Can only call _dropCollection on server collections");       // 695
  self._collection.dropCollection();                                                                                  // 697
};                                                                                                                    // 698
Mongo.Collection.prototype._createCappedCollection = function (byteSize, maxDocuments) {                              // 699
  var self = this;                                                                                                    // 700
  if (!self._collection._createCappedCollection) throw new Error("Can only call _createCappedCollection on server collections");
  self._collection._createCappedCollection(byteSize, maxDocuments);                                                   // 703
};                                                                                                                    // 704
                                                                                                                      //
/**                                                                                                                   // 706
 * @summary Returns the [`Collection`](http://mongodb.github.io/node-mongodb-native/2.2/api/Collection.html) object corresponding to this collection from the [npm `mongodb` driver module](https://www.npmjs.com/package/mongodb) which is wrapped by `Mongo.Collection`.
 * @locus Server                                                                                                      //
 */                                                                                                                   //
Mongo.Collection.prototype.rawCollection = function () {                                                              // 710
  var self = this;                                                                                                    // 711
  if (!self._collection.rawCollection) {                                                                              // 712
    throw new Error("Can only call rawCollection on server collections");                                             // 713
  }                                                                                                                   // 714
  return self._collection.rawCollection();                                                                            // 715
};                                                                                                                    // 716
                                                                                                                      //
/**                                                                                                                   // 718
 * @summary Returns the [`Db`](http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html) object corresponding to this collection's database connection from the [npm `mongodb` driver module](https://www.npmjs.com/package/mongodb) which is wrapped by `Mongo.Collection`.
 * @locus Server                                                                                                      //
 */                                                                                                                   //
Mongo.Collection.prototype.rawDatabase = function () {                                                                // 722
  var self = this;                                                                                                    // 723
  if (!(self._driver.mongo && self._driver.mongo.db)) {                                                               // 724
    throw new Error("Can only call rawDatabase on server collections");                                               // 725
  }                                                                                                                   // 726
  return self._driver.mongo.db;                                                                                       // 727
};                                                                                                                    // 728
                                                                                                                      //
/**                                                                                                                   // 731
 * @summary Create a Mongo-style `ObjectID`.  If you don't specify a `hexString`, the `ObjectID` will generated randomly (not using MongoDB's ID construction rules).
 * @locus Anywhere                                                                                                    //
 * @class                                                                                                             //
 * @param {String} [hexString] Optional.  The 24-character hexadecimal contents of the ObjectID to create             //
 */                                                                                                                   //
Mongo.ObjectID = MongoID.ObjectID;                                                                                    // 737
                                                                                                                      //
/**                                                                                                                   // 739
 * @summary To create a cursor, use find. To access the documents in a cursor, use forEach, map, or fetch.            //
 * @class                                                                                                             //
 * @instanceName cursor                                                                                               //
 */                                                                                                                   //
Mongo.Cursor = LocalCollection.Cursor;                                                                                // 744
                                                                                                                      //
/**                                                                                                                   // 746
 * @deprecated in 0.9.1                                                                                               //
 */                                                                                                                   //
Mongo.Collection.Cursor = Mongo.Cursor;                                                                               // 749
                                                                                                                      //
/**                                                                                                                   // 751
 * @deprecated in 0.9.1                                                                                               //
 */                                                                                                                   //
Mongo.Collection.ObjectID = Mongo.ObjectID;                                                                           // 754
                                                                                                                      //
/**                                                                                                                   // 756
 * @deprecated in 0.9.1                                                                                               //
 */                                                                                                                   //
Meteor.Collection = Mongo.Collection;                                                                                 // 759
                                                                                                                      //
// Allow deny stuff is now in the allow-deny package                                                                  // 761
_.extend(Meteor.Collection.prototype, AllowDeny.CollectionPrototype);                                                 // 762
                                                                                                                      //
function popCallbackFromArgs(args) {                                                                                  // 764
  // Pull off any callback (or perhaps a 'callback' variable that was passed                                          // 765
  // in undefined, like how 'upsert' does it).                                                                        // 766
  if (args.length && (args[args.length - 1] === undefined || args[args.length - 1] instanceof Function)) {            // 767
    return args.pop();                                                                                                // 770
  }                                                                                                                   // 771
}                                                                                                                     // 772
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"connection_options.js":function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/mongo/connection_options.js                                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/**                                                                                                                   // 1
 * @summary Allows for user specified connection options                                                              //
 * @example http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/                //
 * @locus Server                                                                                                      //
 * @param {Object} options User specified Mongo connection options                                                    //
 */                                                                                                                   //
Mongo.setConnectionOptions = function () {                                                                            // 7
  function setConnectionOptions(options) {                                                                            // 7
    check(options, Object);                                                                                           // 8
    Mongo._connectionOptions = options;                                                                               // 9
  }                                                                                                                   // 10
                                                                                                                      //
  return setConnectionOptions;                                                                                        // 7
}();                                                                                                                  // 7
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{"extensions":[".js",".json"]});
require("./node_modules/meteor/mongo/mongo_driver.js");
require("./node_modules/meteor/mongo/oplog_tailing.js");
require("./node_modules/meteor/mongo/observe_multiplex.js");
require("./node_modules/meteor/mongo/doc_fetcher.js");
require("./node_modules/meteor/mongo/polling_observe_driver.js");
require("./node_modules/meteor/mongo/oplog_observe_driver.js");
require("./node_modules/meteor/mongo/local_collection_driver.js");
require("./node_modules/meteor/mongo/remote_collection_driver.js");
require("./node_modules/meteor/mongo/collection.js");
require("./node_modules/meteor/mongo/connection_options.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package.mongo = {}, {
  MongoInternals: MongoInternals,
  MongoTest: MongoTest,
  Mongo: Mongo
});

})();

//# sourceMappingURL=mongo.js.map
