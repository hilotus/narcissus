import Ember from 'ember';

var cache = {};

export default Ember.Object.extend({
  find: function(clazz, id) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      records = [],
      query = adapter._buildQuery(id),
      store = this;

    if (typeKey === 'User') {
      typeKey = '_' + typeKey;
    }

    if (typeof(id) === 'string') {
      if (cache[typeKey] && cache[typeKey][id]) {
        return Ember.RSVP.resolve([cache[typeKey][id]]);
      }
    } else {
      // if need pagenite or order, query by parse server
      if (!query.limit && !query.order && cache[typeKey]) {
        for(var idKey in cache[typeKey]) {
          var isExist = false;
          for(var key in query.where) {
            if (Ember.isEqual(query.where[key], cache[typeKey][idKey].get(key))) {
              isExist = true;
              break;
            }
          }

          if (isExist) {
            records.pushObject(cache[typeKey][idKey]);
          }
        }
        return Ember.RSVP.resolve(records);
      }
    }

    return adapter.find(clazz, id).then(function(responseJson){
      responseJson.results.forEach(function(r){
        records.pushObject(store._push(clazz, r));
      });
      return Ember.RSVP.resolve(records);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON);
    });
  },

  createRecord: function(clazz, data) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.createRecord(clazz, data).then(function(responseJson){
      data.id = responseJson.objectId;
      data.updatedAt = responseJson.createdAt;
      return Ember.RSVP.resolve(Ember.merge(data, responseJson));
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON);
    });
  },

  updateRecord: function(clazz, id, data) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.updateRecord(clazz, id, data).then(function(responseJson){
      return Ember.RSVP.resolve(responseJson);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON);
    });
  },

  distroyRecord: function(clazz, id) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.distroyRecord(clazz, id).then(function(){
      return Ember.RSVP.resolve();
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON);
    });
  },


  /*
  * Get Model Class by class name.
  */
  _getModelClazz: function(clazz) {
    if (typeof(clazz) === 'string') {
      return this.container.lookup('model:%@'.fmt(clazz)).constructor;
    } else {
      return clazz;
    }
  },

  /*
  * Push a record to cache
  */
  _push: function(clazz, data) {
    var record;

    if (data instanceof Ember.Object) {
      record = data;
    } else {
      data.id = data.id || data.objectId;
      record = clazz.create();
      record.pushData(data);
    }

    cache[clazz.typeKey] = cache[clazz.typeKey] || {};
    cache[clazz.typeKey][data.id] = record;

    return record;
  },

  /*
  * Update a record in cache
  */
  _reload: function(clazz, record, id) {
    cache[clazz.typeKey][id] = record;
  },

  /*
  * Delete a record from cache
  */
  _pull: function(clazz, id) {
    if (cache[clazz.typeKey][id]) {
      delete cache[clazz.typeKey][id];
    }
  }
});