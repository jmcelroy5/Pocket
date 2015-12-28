var Cards = new Mongo.Collection('cards');

if (Meteor.isClient) {
  Template.list.helpers({
    cards: () => {
      return Cards.find({}, {sort: {createdAt: -1}})
    }
  })

  Template.body.events({
    'submit [data-action="save"]': (e) => {
      e.preventDefault();
      // save form values as new link doc
      Meteor.call('add', e.target.url.value)
      // clear the form
      e.target.url.value = ''
    }
  })

  Template.card.events({
    'click [data-action="delete"]': (e) => {
      e.preventDefault()
      const id = e.target.parentElement.getAttribute('data-id')
      Meteor.call('delete', id)
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      add: (link) => {
        const {url, domain, image, title} = ScrapeParser.get(link)
        Cards.insert({url, domain, image, title, createdAt: Date.now()})
      }
    , delete: (id) => {
      Cards.remove(id)
    }
    }
    })
  });
}

function parseDomain (url) {
  if (url.indexOf('http') > -1) return url.split('/')[2]
  else return url.split('/')[0]
}
