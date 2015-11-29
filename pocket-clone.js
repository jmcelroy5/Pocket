if (Meteor.isClient) {
  Template.list.helpers({
    links: [
      {
        image: 'http://a.fastcompany.net/multisite_files/fastcompany/imagecache/1280/poster/2015/10/3052885-poster-p-2-these-things-cant-fail.jpg'
      , url: 'http://www.fastcompany.com/3052885/mark-zuckerberg-facebook'
      , title: 'Inside Mark Zuckerberg\'s Plan for the Future of Facebook'
      }
    ]
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
