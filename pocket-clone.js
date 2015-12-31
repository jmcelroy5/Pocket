var Cards = new Mongo.Collection('cards');

Router.route('/', function () {
  this.render('App', {
    data: () => {
      const cards = Cards.find({archived: false}, {sort: {createdAt: -1}})
      return {header: 'My List', cards}
    }
  })
})

Router.route('/archive', function () {
  this.render('App', {
    data: ()  => ({
      header: 'Archived'
    , cards: Cards.find({archived: true}, {sort: {createdAt: -1}})
    })
  })
})

Router.route('/favorites', function () {
  this.render('App', {
    data: ()  => ({
      header: 'Favorites'
    , cards: Cards.find({favorite: true}, {sort: {createdAt: -1}})
    })
  })
})

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
    'click [data-action="delete-popover"]': (e, template) => {
      e.preventDefault()
      template.$('.popover').toggleClass('visible')
      // keep the toolbar visible while popover is active
      template.$('.toolbar-icon:not(.gold)').toggleClass('fade')
    }
  , 'click [data-action="delete-confirm"]': (e, template) => {
    e.preventDefault()
    template.$('.popover').toggleClass('visible')
    const id = e.target.parentElement.getAttribute('data-id')
    Meteor.call('delete', id)
  }
  , 'click [data-action="archive"]': (e) => {
      e.preventDefault()
      const id = e.target.parentElement.getAttribute('data-id')
      Meteor.call('archive', id)
  }
  , 'click [data-action="favorite"]': (e) => {
      e.preventDefault()
      const id = e.target.parentElement.getAttribute('data-id')
      Meteor.call('favorite', id)
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
    , favorite: (id) => {
      const current = Cards.findOne({_id: id}).favorite
      Cards.update(id, {
        $set: {favorite: !current}
      })
    }
    })
  });
}

function parseDomain (url) {
  if (url.indexOf('http') > -1) return url.split('/')[2]
  else return url.split('/')[0]
}
