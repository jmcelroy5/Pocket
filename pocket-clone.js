var Links = new Mongo.Collection('links');

if (Meteor.isClient) {
  Template.list.helpers({
    links: () => {
      return Links.find({}, {sort: {createdAt: -1}})
    }
  })

  Template.body.events({
    'submit [data-action="save"]': (e) => {
      e.preventDefault();
      // save form values as new link doc
      Meteor.call('addLink', e.target.url.value)
      // clear the form
      e.target.url.value = ''
    }
  })

  Template.link.events({
    'click [data-action="delete"]': (e) => {
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

function parseDomain (url) {
  if (url.indexOf('http') > -1) return url.split('/')[2]
  else return url.split('/')[0]
}
