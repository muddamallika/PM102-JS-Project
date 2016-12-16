import { Session } from 'meteor/session'

if(Meteor.isClient) {

Template.article_group.helpers({
  articles: function() {
  	var selectval=Session.get("selectval");
    var a = selectval;
    return Articles.find({Category: a}).fetch().reverse();
      
          /*paging*/
     /* var count=Articles.find({Category: a}).count();
      if(count > 3)
          {
              alert(count);
              for(var i=0; i<count;i++)
                  {
                      for(var j=0; j<3;j++)
                          {
                      var articleID=Articles.find({Category: a}).fetch()[j]._id;
                      var ArticleName=Articles.find({Category: a}).fetch()[j].ArticleName;
                      var AuthorName=Articles.find({Category: a}).fetch()[j].AuthorName;
                      var createdat=Articles.find({Category: a}).fetch()[j].createdat;
                      var ArticleInitial=Articles.find({Category: a}).fetch()[j].ArticleInitial;
              Paging.insert({
                  id: i,
                  ArticleID: articleID,
                  ArticleName:ArticleName,
                  AuthorName:AuthorName,
                  createdat:createdat,
                  ArticleInitial:ArticleInitial

    });
                  }
          }
              
          }*/
  }
});
    
    

Template.Articles_Sel.events({
  "change #chats": function(event, template){
    var selectValue = template.$("#chats").val();
    Session.set("selectval",selectValue);
      
      $("#articlesel").show();
      $("#Welcome").hide();
      
    switch(selectValue){
        case "Fashion":
            $("#imgF").show();
            $("#imgT").hide();
            $("#imgL").hide();
            break;
        case "Technology":
            $("#imgT").show();
            $("#imgF").hide();
            $("#imgL").hide();
            break;
        case "Lifestyle":
            $("#imgL").show();
            $("#imgF").hide();
            $("#imgT").hide();
            break;
        default:
            $("#imgF").hide();
            $("#imgT").hide();
            $("#imgL").hide();
  }
  }
   
});
    
    

    Template.Allarticle.helpers({
      articles: function() {
      return Articles.find().fetch().reverse();
      }
    });
    
    Template.readArticle.helpers({
     articles: function() {
     return Articles.find().fetch();
     }
    });
    
     
    
    Template.ArticleHome.helpers({
        articles: function() {
            return Articles.find().fetch();
        }
    }); 
    
      Template.Top3Article.helpers({
          articles: function() {
              return Articles.find({},{limit:3}).fetch();
          }
      }); 
    
    Template.readArticle.helpers({
      myarticles: function() {
          return myArticles.find().fetch();
      }
      }); 
    
    Template.paging.helpers({
        paging: function() {
            return Paging.find().fetch();
        }
    }); 
    
if(Meteor.isServer) {

}
}


