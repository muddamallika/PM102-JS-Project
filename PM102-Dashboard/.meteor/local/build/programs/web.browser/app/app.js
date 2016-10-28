var require = meteorInstall({"client":{"views":{"articles":{"template.article.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// client/views/articles/template.article.js                               //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
                                                                           // 1
Template.body.addContent((function() {                                     // 2
  var view = this;                                                         // 3
  return "";                                                               // 4
}));                                                                       // 5
Meteor.startup(Template.body.renderToDocument);                            // 6
                                                                           // 7
Template.__checkName("article");                                           // 8
Template["article"] = new Template("Template.article", (function() {       // 9
  var view = this;                                                         // 10
  return [ HTML.Raw('<div class="container">\n    <form id="insert-form">\n      <h3>Insert record</h3>\n      <div class="col-xs-4">\n        <input type="text" class="form-control" id="aname" placeholder="Article Name">\n      </div>\n      <div class="col-xs-4">\n        <input type="text" class="form-control" id="acat" placeholder="Article Category">\n      </div>\n      <div class="col-xs-4">\n        <input type="submit" class="btn btn-primary" name="Post Article">\n      </div>\n    </form>\n  </div>\n\n  '), HTML.DIV({
    class: "container"                                                     // 12
  }, "\n\n      ", HTML.Raw("<h3>All Records</h3>"), "\n      ", HTML.Raw('<div class="row">\n        <div class="col-xs-4">\n          <h3><b>Article Name</b></h3>\n        </div>\n        <div class="col-xs-4">\n          <h3><b>Article Category</b></h3>\n        </div>\n      </div>'), "\n      ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("records"));                         // 14
  }, function() {                                                          // 15
    return [ "\n      ", HTML.DIV({                                        // 16
      class: "row"                                                         // 17
    }, "\n        ", HTML.DIV({                                            // 18
      class: "col-xs-4"                                                    // 19
    }, "\n          ", Blaze.View("lookup:aname", function() {             // 20
      return Spacebars.mustache(view.lookup("aname"));                     // 21
    }), "\n        "), "\n        ", HTML.DIV({                            // 22
      class: "col-xs-4"                                                    // 23
    }, "\n          ", Blaze.View("lookup:acat", function() {              // 24
      return Spacebars.mustache(view.lookup("acat"));                      // 25
    }), "\n        "), "\n      "), "\n      " ];                          // 26
  }), "\n  ") ];                                                           // 27
}));                                                                       // 28
                                                                           // 29
/////////////////////////////////////////////////////////////////////////////

},"article.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// client/views/articles/article.js                                        //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
Meteor.subscribe('article');                                               // 1
/////////////////////////////////////////////////////////////////////////////

}}},"layouts":{"template.HomeLayout.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// client/layouts/template.HomeLayout.js                                   //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
                                                                           // 1
Template.__checkName("HomeLayout");                                        // 2
Template["HomeLayout"] = new Template("Template.HomeLayout", (function() {
  var view = this;                                                         // 4
  return HTML.Raw('<header>\n    <h1> Home Layout </h1>\n\n  </header>\n  <main>\n    <div class="board">\n      <h2> Organise things here</h2>\n    </div>\n  </main>');
}));                                                                       // 6
                                                                           // 7
/////////////////////////////////////////////////////////////////////////////

},"template.MainLayout.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// client/layouts/template.MainLayout.js                                   //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
                                                                           // 1
Template.__checkName("MainLayout");                                        // 2
Template["MainLayout"] = new Template("Template.MainLayout", (function() {
  var view = this;                                                         // 4
  return [ HTML.Raw("<header>\n    <h1> Post your Article </h1>\n  </header>\n  "), HTML.MAIN("\n    ", Blaze._TemplateWith(function() {
    return {                                                               // 6
      template: Spacebars.call(view.lookup("main"))                        // 7
    };                                                                     // 8
  }, function() {                                                          // 9
    return Spacebars.include(function() {                                  // 10
      return Spacebars.call(Template.__dynamic);                           // 11
    });                                                                    // 12
  }), "\n  ") ];                                                           // 13
}));                                                                       // 14
                                                                           // 15
/////////////////////////////////////////////////////////////////////////////

}},"main.js":["meteor/templating","meteor/reactive-var","./main.html",function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// client/main.js                                                          //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
var Template;module.import('meteor/templating',{"Template":function(v){Template=v}});var ReactiveVar;module.import('meteor/reactive-var',{"ReactiveVar":function(v){ReactiveVar=v}});module.import('./main.html');
                                                                           // 2
                                                                           //
                                                                           // 4
/////////////////////////////////////////////////////////////////////////////

}]},"lib":{"ironrouter.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// lib/ironrouter.js                                                       //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
Router.route('/article/postarticle', function () {                         // 1
  this.render('article');                                                  // 2
});                                                                        // 3
/////////////////////////////////////////////////////////////////////////////

}},"both":{"collections":{"article.js":function(){

/////////////////////////////////////////////////////////////////////////////
//                                                                         //
// both/collections/article.js                                             //
//                                                                         //
/////////////////////////////////////////////////////////////////////////////
                                                                           //
Article = new Meteor.Collection("Article");                                // 1
                                                                           //
if (Meteor.isClient) {                                                     // 3
  Template.article.helpers({                                               // 4
    'records': function () {                                               // 5
      function records() {                                                 // 5
        return Article.find({});                                           // 6
      }                                                                    // 7
                                                                           //
      return records;                                                      // 5
    }()                                                                    // 5
  });                                                                      // 4
                                                                           //
  Template.article.events({                                                // 10
    'submit #insert-form': function () {                                   // 11
      function submitInsertForm(e, t) {                                    // 11
        e.preventDefault();                                                // 12
        var name = t.find('#aname').value;                                 // 13
        var cat = t.find('#acat').value;                                   // 14
                                                                           //
        Article.insert({ name: aname, course: acat });                     // 16
      }                                                                    // 17
                                                                           //
      return submitInsertForm;                                             // 11
    }()                                                                    // 11
  });                                                                      // 10
}                                                                          // 19
                                                                           //
if (Meteor.isServer) {}                                                    // 24
/////////////////////////////////////////////////////////////////////////////

}}}},{"extensions":[".js",".json",".html",".css"]});
require("./client/views/articles/template.article.js");
require("./client/layouts/template.HomeLayout.js");
require("./client/layouts/template.MainLayout.js");
require("./lib/ironrouter.js");
require("./client/views/articles/article.js");
require("./both/collections/article.js");
require("./client/main.js");