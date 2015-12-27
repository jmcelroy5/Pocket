var Links = new Mongo.Collection('links');

if (Meteor.isClient) {
  Template.list.helpers({
    links: () => {
      return Links.find({}, {sort: {createdAt: -1}})
    }
  })

  Template.body.events({
    'submit .save-link': (e) => {
      e.preventDefault();
      // save form values as new link doc
      Meteor.call('addLink', e.target.url.value)
      // clear the form
      e.target.url.value = ''
    }
  })

  Template.link.events({
    'click .delete': (e) => {
      e.preventDefault()
      // delete link doc
      Meteor.call('deleteLink', e.target.getAttribute('data-id'))
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      addLink: (link) => {
        const {url, domain, image, title} = ScrapeParser.get(link)
        Links.insert({url, domain, image, title, createdAt: Date.now()})
      }
    , removeLink: (id) => {
      Links.remove(id)
    }
    })
  });
}
