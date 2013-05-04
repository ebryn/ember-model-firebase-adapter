var attr = Ember.attr;

Ember.Model.reopenClass({
  adapter: Ember.FirebaseAdapter.create({rootURL: "https://ember-model-firebase-adapter.firebaseio.com"})
});

var User = Ember.Model.extend({
  id: attr(),
  name: attr()
});

User.url = "users";

// User.create({name: "Erik"}).save();

User.find();