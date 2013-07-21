var App = Ember.Application.create();

var attr = Ember.attr;

Ember.Model.reopenClass({
  adapter: Ember.FirebaseAdapter.create({rootURL: "https://ember-model-firebase-adapter.firebaseio.com"})
});

App.Person = Ember.Model.extend({
  id: attr(),
  name: attr()
});
App.Person.url = "people";

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return App.Person.find();
  }
});

App.IndexController = Ember.ArrayController.extend({
  newName: null,

  save: function() {
    App.Person.create({name: this.get('newName')}).save();
    this.set('newName', null);
  },

  deleteRecord: function(model) {
    model.deleteRecord();
  }
});
