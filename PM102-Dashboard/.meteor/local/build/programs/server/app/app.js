var require = meteorInstall({"lib":{"ironrouter.js":function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// lib/ironrouter.js                                                        //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
Router.route('/article/postarticle', function () {                          // 1
  this.render('article');                                                   // 2
});                                                                         // 3
//////////////////////////////////////////////////////////////////////////////

}},"both":{"collections":{"article.js":function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// both/collections/article.js                                              //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
Article = new Meteor.Collection("Article");                                 // 1
                                                                            //
if (Meteor.isClient) {                                                      // 3
  Template.article.helpers({                                                // 4
    'records': function () {                                                // 5
      function records() {                                                  // 5
        return Article.find({});                                            // 6
      }                                                                     // 7
                                                                            //
      return records;                                                       // 5
    }()                                                                     // 5
  });                                                                       // 4
                                                                            //
  Template.article.events({                                                 // 10
    'submit #insert-form': function () {                                    // 11
      function submitInsertForm(e, t) {                                     // 11
        e.preventDefault();                                                 // 12
        var name = t.find('#aname').value;                                  // 13
        var cat = t.find('#acat').value;                                    // 14
                                                                            //
        Article.insert({ name: aname, course: acat });                      // 16
      }                                                                     // 17
                                                                            //
      return submitInsertForm;                                              // 11
    }()                                                                     // 11
  });                                                                       // 10
}                                                                           // 19
                                                                            //
if (Meteor.isServer) {}                                                     // 24
//////////////////////////////////////////////////////////////////////////////

}}},"server":{"publish.js":function(){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// server/publish.js                                                        //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
Meteor.publish('article', function () {                                     // 1
  return Article.find({});                                                  // 2
});                                                                         // 3
//////////////////////////////////////////////////////////////////////////////

},"main.js":["meteor/meteor",function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////
//                                                                          //
// server/main.js                                                           //
//                                                                          //
//////////////////////////////////////////////////////////////////////////////
                                                                            //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});
                                                                            //
Meteor.startup(function () {                                                // 3
  // code to run on server at startup                                       // 4
});                                                                         // 5
//////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json"]});
require("./lib/ironrouter.js");
require("./both/collections/article.js");
require("./server/publish.js");
require("./server/main.js");
//# sourceMappingURL=app.js.map
