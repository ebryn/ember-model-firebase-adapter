var get = Ember.get;

Ember.FirebaseAdapter = Ember.Adapter.extend({
  find: function(record, id) {
    var url = this.buildURL(record.constructor, id), firebase = new Firebase(url);
    firebase.on('value', function(snapshot) {
      record.load(id, snapshot.val());
    });
  },

  findAll: function(klass, records) {
    var url = this.buildURL(klass), firebase = new Firebase(url);
    firebase.on('value', function(snapshot) {
      var data = snapshot.val(), dataArray = [];
      for (var key in data) {
        data[key].id = key;
        dataArray.push(data[key]);
      }
      records.load(klass, dataArray);
    });
  },

  findMany: null, // function(klass, records, ids) {}, // find many records by ID (batch find)

  // findQuery: function(klass, records, params) {}, // find records using a query

  createRecord: function(record) {
    var url = this.buildURL(record.constructor),
        firebase = new Firebase(url),
        newChild = firebase.push(),
        data = record.toJSON();

    delete data.id; // Firebase doesn't like undefined values

    newChild.set(data, function(error) {
      if (error) { throw new Error("Firebase error: ", error); }
      record.load(newChild.name(), {});
      record.didCreateRecord();
    });
  },

  saveRecord: function(record) {
    var url = this.buildURL(record.constructor, get(record, 'id')),
        firebase = new Firebase(url),
        dirtyAttributes = record.get("_dirtyAttributes"),
        data = record.getProperties(dirtyAttributes);

    firebase.update(data, function(error) {
      if (error) { throw new Error("Firebase error: ", error); }
      record.didSaveRecord();
    });
  },

  deleteRecord: function(record) {
    var url = this.buildURL(record.constructor, get(record, 'id')), firebase = new Firebase(url);
    firebase.remove(function(error) {
      if (error) { throw new Error("Firebase error: ", error); }
      record.didDeleteRecord();
    });
  },

  buildURL: function(klass, id) {
    var rootURL = this.rootURL;
    if (!rootURL) { throw new Error("Ember.FirebaseAdapter requires a rootURL to be specified"); }
    var modelURL = klass.url;
    if (!modelURL) { throw new Error("Ember.FirebaseAdapter requires a url property to be specified on your model class"); }
    if (id) {
      return "%@/%@/%@".fmt(rootURL, modelURL, id);
    } else {
      return "%@/%@".fmt(rootURL, modelURL);
    }
  }
});