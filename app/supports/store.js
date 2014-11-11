import Ember from 'ember';

var cache = {};

export default Ember.Object.extend({
  find: function(clazz, id) {
    if (typeof(id) === 'string') {
      return this.findById(clazz, id);
    }

    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      records = [],
      store = this;

    /*
    * id is query json,
    * struct:
    * query = {limit: 0, skip: 0, order: 0, count: 0, where: {}}
    */
    // TODO: Query from cache without paginate and order now, change in future.
    if (!id.limit && !id.order && cache[typeKey]) {
      for(var idKey in cache[typeKey]) {
        var isExist = true;
        for(var key in id.where) {
          if (!Ember.isEqual(id.where[key], cache[typeKey][idKey].get(key))) {
            isExist = false;
            break;
          }
        }

        if (isExist) {
          records.pushObject(cache[typeKey][idKey]);
        }
      }

      if (records.length > 0) {
        return Ember.RSVP.resolve(records);
      }
    }

    return adapter.find(clazz, id).then(function(responseJson){
      responseJson.results.forEach(function(r){
        var record = store._push(clazz, r);
        records.pushObject(record);
      });
      return Ember.RSVP.resolve(records);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'find no records.'});
    });
  },

  findById: function(clazz, id) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      store = this;

    if (cache[typeKey] && cache[typeKey][id]) {
      return Ember.RSVP.resolve(cache[typeKey][id]);
    }

    return adapter.find(clazz, id).then(function(responseJson){
      var record = store._push(clazz, responseJson);
      return Ember.RSVP.resolve(record);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'find no records.'});
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
      return Ember.RSVP.reject(response.responseJSON || {'error': 'can not create record.'});
    });
  },

  updateRecord: function(clazz, id, data) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.updateRecord(clazz, id, data).then(function(responseJson){
      return Ember.RSVP.resolve(responseJson);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'can not update record.'});
    });
  },

  destroyRecord: function(clazz, id) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.destroyRecord(clazz, id).then(function(){
      return Ember.RSVP.resolve();
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'can not destroy record.'});
    });
  },

  batchRecord: function() {

  },

  /*
  * set model properties
  * schema: {
  *   'belongTo': {'author': 'user', 'category': 'term'},
  *   'hasMany': {'tags': 'term'}
  * }
  */
  normalize: function(record, data) {
    var schema = record.constructor.schema;

    for (var key in data) {
      if (!Ember.isNone(schema.belongTo[key])) {
        this.normalizeBelongTo(record, schema.belongTo[key], key, data[key]);
      } else if (!Ember.isNone(schema.hasMany[key])) {
        this.normalizeHasMany(record, schema.hasMany[key], key, data[key]);
      } else {
        record.set(key, data[key]);
      }
    }
    return record;
  },

  /*
  * record: model instance
  * typeKey: model id
  * key: model column name
  * value: model column value
  */
  normalizeBelongTo: function(record, typeKey, key, value) {
    this.find(typeKey, value).then(function(r){
      record.set(key, r);
    });
  },

  /*
  * record: model instance
  * typeKey: model id
  * key: model column name
  * value: model column value
  */
  normalizeHasMany: function(record, typeKey, key, values) {
    // TODO: normalize hasMany related column
    var store = this;

    record.set(key, []);
    values.forEach(function(value){
      store.find(typeKey, value).then(function(r){
        record.get(key).pushObject(r);
      });
    });
  },
  /*
  * end normalize
  */

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
  * get Model instance
  */
  _push: function(clazz, data) {
    var record;

    if (data instanceof Ember.Object) {
      record = data;
    } else {
      data.id = data.id || data.objectId;
      record = clazz.create();
      record.merge(data);
    }

    cache[clazz.typeKey] = cache[clazz.typeKey] || {};
    cache[clazz.typeKey][data.id] = record;

    // normalize record.
    if (data instanceof Ember.Object) {
      this.normalize(record, data.get('modelData'));
    } else {
      this.normalize(record, data);
    }

    return record;
  },

  /*
  * Update a record in cache
  */
  _reload: function(clazz, record, modalData) {
    cache[clazz.typeKey][modalData.id] = record;
    this.normalize(record, modalData);
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