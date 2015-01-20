import Ember from 'ember';

export default Ember.Object.extend({
  cache: {},

  find: function(clazz, id) {
    if (typeof(id) === 'string') {
      return this.findById(clazz, id);
    }
    if (!id) {
      id = {};
    }

    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      records = [],
      idKey = "",
      whereKey = "",
      store = this;

    /*
    * id is query json,
    * struct:
    * query = {limit: 0, skip: 0, order: 0, count: 0, where: {}}
    */
    // TODO: Query from cache without paginate and order now, change in future.
    var cachedRecords = this.get('cache')[typeKey];
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
            records.pushObject(this.get('cache')[typeKey][idKey]);
          }
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
    }).catch(function(exception){
      return Ember.RSVP.reject({'error': exception.message});
    });
  },

  findById: function(clazz, id) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application'),
      typeKey = clazz.typeKey,
      store = this;

    if (this.get('cache')[typeKey] && this.get('cache')[typeKey][id]) {
      return Ember.RSVP.resolve(this.get('cache')[typeKey][id]);
    }

    return adapter.find(clazz, id).then(function(responseJson){
      var record = store._push(clazz, responseJson);
      return Ember.RSVP.resolve(record);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'find no records has some errors.'});
    }).catch(function(exception){
      return Ember.RSVP.reject({'error': exception.message});
    });
  },

  createRecord: function(clazz, data) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.createRecord(clazz, data).then(function(responseJson){
      data.id = responseJson._id;
      data.updated_at = responseJson.created_at;
      return Ember.RSVP.resolve(Ember.merge(data, responseJson));
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'create record has some errors.'});
    }).catch(function(exception){
      return Ember.RSVP.reject({'error': exception.message});
    });
  },

  updateRecord: function(clazz, id, data) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.updateRecord(clazz, id, data).then(function(responseJson){
      return Ember.RSVP.resolve(responseJson);
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'update record has some errors.'});
    }).catch(function(exception){
      return Ember.RSVP.reject({'error': exception.message});
    });
  },

  destroyRecord: function(clazz, id) {
    clazz = this._getModelClazz(clazz);

    var adapter = this.container.lookup('adapter:application');

    return adapter.destroyRecord(clazz, id).then(function(){
      return Ember.RSVP.resolve();
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'destroy record has some errors.'});
    }).catch(function(exception){
      return Ember.RSVP.reject({'error': exception.message});
    });
  },

  batch: function(operations) {
    var adapter = this.container.lookup('adapter:application'),
      store = this;

    return adapter.batch(operations).then(function(response){
      var results = response.responseJson,
        records = response.batchRecords;

      results.forEach(function(result, index){
        var record = records[index];
        if (typeof(result.success) === 'boolean') {  // destroy success
          store._pull(record.getTypeKey(), record.get('id'));
        } else if (result.success.objectId || result.success._id) {  // create success
          store._push(record.constructor, result, record);
        }  {  // update success
          store._reload(record.getTypeKey(), result, record);
        }
      });
      return Ember.RSVP.resolve();
    }, function(response){
      return Ember.RSVP.reject(response.responseJSON || {'error': 'batch operations has some errors.'});
    }).catch(function(exception){
      return Ember.RSVP.reject({'error': exception.message});
    });
  },


  /*
  * set model properties
  * schema: {
  *   'belongTo': {'creator': 'user', 'category': 'term'},
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
      return this.container.lookup('model:%@'.fmt(clazz.toLowerCase())).constructor;
    } else {
      return clazz;
    }
  },

  /*
  * push record(s) into store
  * clazz: string / model class
  */
  _push: function(clazz, json, record) {
    if (Ember.isArray(json)) {
      var records = [];
      for (var i = 0; i < json.length; i++) {
         records.push(this._push_one(clazz, json[i], record));
      }
      return records;
    } else {
      return this._push_one(clazz, json, record);
    }
  },
  _push_one: function(clazz, json, record) {
    clazz = this._getModelClazz(clazz);
    json.id = json.id || json.objectId || json._id;

    if (Ember.isNone(record)) {
      record = clazz.create();
    }
    record.merge(json);

    this.get('cache')[clazz.typeKey] = this.get('cache')[clazz.typeKey] || {};
    this.get('cache')[clazz.typeKey][json.id] = record;

    // normalize record.
    this.normalize(record, record.get('modelData'));
    return record;
  },

  /*
  * Update a record in cache
  * record: modle instance/model id
  */
  _reload: function(clazz, json, record) {
    if (typeof(record) === 'string') {
      record = this.get('cache')[clazz.typeKey][record];
    }

    // use merged responseJson to update changeData
    Ember.merge(json, record.get('changeData'));
    record.merge(json);

    clazz = this._getModelClazz(clazz);
    this.get('cache')[clazz.typeKey][record.get('id')] = record;
    this.normalize(record, record.get('modelData'));
  },

  /*
  * Delete a record from cache
  */
  _pull: function(typeKey, id) {
    if (this.get('cache')[typeKey][id]) {
      delete this.get('cache')[typeKey][id];
    }
  }
});