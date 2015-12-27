var Links = new Mongo.Collection('links');

if (Meteor.isClient) {
  Template.list.helpers({
    links: () => {
      return Links.find({}, {sort: {createdAt: -1}})
    }
  })
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
