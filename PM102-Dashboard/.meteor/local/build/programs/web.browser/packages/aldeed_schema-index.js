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
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var _ = Package.underscore._;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var check = Package.check.check;
var Match = Package.check.Match;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Mongo = Package.mongo.Mongo;

(function(){

///////////////////////////////////////////////////////////////////////////////////////
//                                                                                   //
// packages/aldeed_schema-index/lib/indexing.js                                      //
//                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////
                                                                                     //
// Extend the schema options allowed by SimpleSchema                                 // 1
SimpleSchema.extendOptions({                                                         // 2
  index: Match.Optional(Match.OneOf(Number, String, Boolean)),                       // 3
  unique: Match.Optional(Boolean),                                                   // 4
  sparse: Match.Optional(Boolean),                                                   // 5
});                                                                                  // 6
                                                                                     // 7
// Define validation error messages (legacy)                                         // 8
if (!SimpleSchema.version || SimpleSchema.version < 2) {                             // 9
  SimpleSchema.messages({                                                            // 10
    notUnique: '[label] must be unique',                                             // 11
  });                                                                                // 12
}                                                                                    // 13
                                                                                     // 14
if (Meteor.isServer) {                                                               // 15
  Collection2.on('schema.attached', function (collection, ss) {                      // 16
    // Define validation error messages                                              // 17
    if (ss.version >= 2) {                                                           // 18
      ss.messageBox.messages({                                                       // 19
        notUnique: '{{label}} must be unique',                                       // 20
      });                                                                            // 21
    }                                                                                // 22
                                                                                     // 23
    function ensureIndex(index, indexName, unique, sparse) {                         // 24
      Meteor.startup(function () {                                                   // 25
        collection._collection._ensureIndex(index, {                                 // 26
          background: true,                                                          // 27
          name: indexName,                                                           // 28
          unique: unique,                                                            // 29
          sparse: sparse                                                             // 30
        });                                                                          // 31
      });                                                                            // 32
    }                                                                                // 33
                                                                                     // 34
    function dropIndex(indexName) {                                                  // 35
      Meteor.startup(function () {                                                   // 36
        try {                                                                        // 37
          collection._collection._dropIndex(indexName);                              // 38
        } catch (err) {                                                              // 39
          // no index with that name, which is what we want                          // 40
        }                                                                            // 41
      });                                                                            // 42
    }                                                                                // 43
                                                                                     // 44
    const propName = ss.version === 2 ? 'mergedSchema' : 'schema';                   // 45
                                                                                     // 46
    // Loop over fields definitions and ensure collection indexes (server side only)
    _.each(ss[propName](), function(definition, fieldName) {                         // 48
      if ('index' in definition || definition.unique === true) {                     // 49
        var index = {}, indexValue;                                                  // 50
        // If they specified `unique: true` but not `index`,                         // 51
        // we assume `index: 1` to set up the unique index in mongo                  // 52
        if ('index' in definition) {                                                 // 53
          indexValue = definition.index;                                             // 54
          if (indexValue === true) indexValue = 1;                                   // 55
        } else {                                                                     // 56
          indexValue = 1;                                                            // 57
        }                                                                            // 58
        var indexName = 'c2_' + fieldName;                                           // 59
        // In the index object, we want object array keys without the ".$" piece     // 60
        var idxFieldName = fieldName.replace(/\.\$\./g, ".");                        // 61
        index[idxFieldName] = indexValue;                                            // 62
        var unique = !!definition.unique && (indexValue === 1 || indexValue === -1);
        var sparse = definition.sparse || false;                                     // 64
                                                                                     // 65
        // If unique and optional, force sparse to prevent errors                    // 66
        if (!sparse && unique && definition.optional) sparse = true;                 // 67
                                                                                     // 68
        if (indexValue === false) {                                                  // 69
          dropIndex(indexName);                                                      // 70
        } else {                                                                     // 71
          ensureIndex(index, indexName, unique, sparse);                             // 72
        }                                                                            // 73
      }                                                                              // 74
    });                                                                              // 75
  });                                                                                // 76
}                                                                                    // 77
///////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:schema-index'] = {};

})();
