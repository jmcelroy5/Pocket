var Cards = new Mongo.Collection('cards');

Router.route('/', function () {
  this.render('App', {
    data: () => {
      const cards = Cards.find({archived: false}, {sort: {createdAt: -1}})
      return {cards}
    }
  })
});

Router.route('/archive', function () {
  this.render('App', {
    data: ()  => ({
      cards: Cards.find({archived: true}, {sort: {createdAt: -1}})
    })
  })
});

if (Meteor.isClient) {
  Template.App.events({
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
  , 'click [data-action="archive"]': (e) => {
      e.preventDefault()
      const id = e.target.parentElement.getAttribute('data-id')
      Meteor.call('archive', id)
  }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.methods({
      add: (link) => {
        const {url, domain, image, title} = ScrapeParser.get(link)
        Cards.insert({
          url
        , domain
        , image
        , title
        , favorite: false
        , archived: false
        , tags: []
        , createdAt: Date.now()
        })
      }
    , delete: (id) => {
      Cards.remove(id)
    }
    , archive: (id) => {
      const current = Cards.findOne({_id: id}).archived
      Cards.update(id, {
        $set: {archived: !current}
      })
    }
    })
  });
}

function parseDomain (url) {
  if (url.indexOf('http') > -1) return url.split('/')[2]
  else return url.split('/')[0]
}
