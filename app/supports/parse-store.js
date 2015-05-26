import Ember from 'ember';

export var __cache__ = {};

export default Ember.Object.extend({
  container: null,

  /*
  * Find
  */
  find: function(clazz, id) {
    if (typeof(id) === 'string') {
      return this.findById(clazz, id);
    }
    if (!id) {
      id = {};
    }

    clazz = this.__getModelClazz(clazz);
    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      records = [],
      idKey = "",
      whereKey = "",
      self = this;

    /*
    * id is query json,
    * struct:
    * query = {limit: 0, skip: 0, order: 0, count: 0, where: {}}
    */
    // TODO: Query from cache without paginate and order now, change in the future.
    var cachedRecords = __cache__[typeKey];
    if (cachedRecords) {
      if ($.isEmptyObject(id)) {
        for(idKey in cachedRecords) {
          records.pushObject(cachedRecords[idKey]);
        }
      } else {
        for(idKey in cachedRecords) {
          var isExist = true;

          // make sure the any condition in id.where, could find the relative obj in cache.
          for(whereKey in id.where) {
            var _tempValue = cachedRecords[idKey].get(whereKey),
              whereValue = id.where[whereKey];

            if (!Ember.isNone(_tempValue)) {
              if (Ember.isArray(whereValue)) {  // column value is an array obj.
                isExist = Ember.isEqual(whereValue.getIds().join(','), _tempValue.getIds().join(','));
              } else {
                if (_tempValue instanceof Ember.Object) {  // column value is an obj.
                  isExist = Ember.isEqual(whereValue, _tempValue.get('id'));
                } else {  // column value is other type.
                  isExist = Ember.isEqual(whereValue, _tempValue);
                }
              }
            }

            if (!isExist) { break; }
          }

          if (isExist) {
            records.pushObject(__cache__[typeKey][idKey]);
          }
        }
      }

      if (records.length > 0) {
        return Ember.RSVP.resolve(records);
      }
    }

    return adapter.find(clazz, id).then(function(json){
      json.results.forEach(function(r){
        var record = self.push(clazz, r);
        records.pushObject(record);
      });
      return Ember.RSVP.resolve(records);
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  },

  /*
  * Find By Id
  */
  findById: function(clazz, id) {
    clazz = this.__getModelClazz(clazz);
    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      self = this;

    if (__cache__[typeKey] && __cache__[typeKey][id]) {
      return Ember.RSVP.resolve(__cache__[typeKey][id]);
    }

    return adapter.find(clazz, id).then(function(json){
      var record = self.push(clazz, json);
      return Ember.RSVP.resolve(record);
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  },

  /*
  * Create Record
  */
  createRecord: function(clazz, data) {
    clazz = this.__getModelClazz(clazz);
    var adapter = this.container.lookup('adapter:application'), self = this;

    return adapter.createRecord(clazz, data).then(function(json){
      data.id = json.objectId;
      data.updatedAt = json.createdAt;
      Ember.merge(data, json);
      return Ember.RSVP.resolve(data);
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  },

  /*
  * Update Record
  */
  updateRecord: function(clazz, id, data) {
    clazz = this.__getModelClazz(clazz);
    var adapter = this.container.lookup('adapter:application'),
      self = this;

    return adapter.updateRecord(clazz, id, data).then(function(json){
      return Ember.RSVP.resolve(json);
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  },

  /*
  * Delete Record
  */
  destroyRecord: function(clazz, id) {
    clazz = this.__getModelClazz(clazz);
    var adapter = this.container.lookup('adapter:application'), self = this;

    return adapter.destroyRecord(clazz, id).then(function(){
      return Ember.RSVP.resolve();
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  },

  /*
  * Batch Request
  */
  batch: function(operations) {
    var adapter = this.container.lookup('adapter:application'),
      self = this;

    return adapter.batch(operations).then(function(response){
      var results = response.responseJson,
        batchRecords = response.batchRecords;

      results.forEach(function(result, index){
        var record = batchRecords[index];
        if (typeof(result.success) === 'boolean') {  // destroy success
          self.pull(record.getTypeKey(), record.get('id'));
        } else if (result.success.objectId || result.success._id) {  // create success
          self.push(record.constructor, result, record);
        } else {  // update success
          self.reload(record.getTypeKey(), result, record);
        }
      });
      return Ember.RSVP.resolve();
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  },

  /*
  * push record(s) into store
  * clazz: string / model class
  */
  push: function(clazz, json, record) {
    if (Ember.isArray(json)) {
      var records = [];
      for (var i = 0; i < json.length; i++) {
         records.push(this.__push(clazz, json[i], record));
      }
      return records;
    } else {
      return this.__push(clazz, json, record);
    }
  },

  /*
  * Update a record in cache
  * record: modle instance/model id
  */
  reload: function(clazz, json, record) {
    if (typeof(record) === 'string') {
      record = __cache__[clazz.typeKey][record];
    }

    // use merged responseJson to update changeData
    Ember.merge(json, record.get('changeData'));
    record.merge(json);

    clazz = this.__getModelClazz(clazz);
    __cache__[clazz.typeKey][record.get('id')] = record;
    this.__normalize(record, record.get('modelData'));
  },

  /*
  * Delete a record from cache
  */
  pull: function(typeKey, id) {
    if (__cache__[typeKey][id]) {
      delete __cache__[typeKey][id];
    }
  },

  /*
  * Internal Methods
  */

  /*
  * set model properties
  * schema: {
  *   'belongTo': {'creator': 'user', 'category': 'term'},
  *   'hasMany': {'tags': 'term'}
  * }
  */
  __normalize: function(record, data) {
    var schema = record.constructor.schema;

    for (var key in data) {
      if (!Ember.isNone(schema.belongTo[key])) {
        this.__normalizeBelongTo(record, schema.belongTo[key], key, data[key]);
      } else if (!Ember.isNone(schema.hasMany[key])) {
        this.__normalizeHasMany(record, schema.hasMany[key], key, data[key]);
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
  __normalizeBelongTo: function(record, typeKey, key, value) {
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
  __normalizeHasMany: function(record, typeKey, key, values) {
    var store = this;
    record.set(key, []);
    values.forEach(function(value){
      store.find(typeKey, value).then(function(r){
        record.get(key).pushObject(r);
      });
    });
  },

  /*
  * Get Model Class by class name.
  */
  __getModelClazz: function(clazz) {
    if (typeof(clazz) === 'string') {
      return this.container.lookup('model:%@'.fmt(clazz.toLowerCase())).constructor;
    } else {
      return clazz;
    }
  },

  /*
  * Push a record into store cache
  */
  __push: function(clazz, json, record) {
    clazz = this.__getModelClazz(clazz);
    json.id = json.id || json.objectId;

    if (Ember.isNone(record)) {
      record = clazz.create();
    }
    record.merge(json);

    __cache__[clazz.typeKey] = __cache__[clazz.typeKey] || {};
    __cache__[clazz.typeKey][json.id] = record;

    // normalize record.
    this.__normalize(record, record.get('modelData'));
    return record;
  }
});
