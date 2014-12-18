import Ember from 'ember';
// import Ajax from 'narcissus/mixins/parse-ajax';
import Ajax from 'narcissus/mixins/ajax';

export default Ember.Object.extend(Ajax, {
  /*
  * clazz: model class
  * id: is a string or a query json
  * https://www.parse.com/docs/rest#queries-compound
  */
  find: function(clazz, id) {
    if (typeof(id) === 'string') {
      return this.findById(clazz, id);
    }

    var typeKey;

    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    if (typeKey === 'User') {
      typeKey = '_' + typeKey;
    }

    // id is a query json
    // https://www.parse.com/docs/rest#queries
    return this.ajax(typeKey, "GET", {'data': id});
  },

  /*
  * clazz: model class
  * id: is a string
  */
  findById: function(clazz, id) {
    var typeKey;

    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    if (typeKey === 'User') {
      typeKey = 'users';
    }

    return this.ajax(typeKey + '/' + id, 'GET');
  },

  /*
  * clazz: model class
  * data: request json for create
  */
  createRecord: function(clazz, data) {
    var typeKey;
    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    return this.ajax(typeKey, 'POST', {'data': data});
  },

  /*
  * clazz: model class
  * id: record id
  * data: json data for update
  */
  updateRecord: function(clazz, id, data) {
    var typeKey;
    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    // update user url is special.
    typeKey = typeKey.match(/User/) ? 'users' : typeKey;

    return this.ajax(typeKey + '/' + id, 'PUT', {'data': data});
  },

  /*
  * clazz: model class
  * id: record id
  */
  destroyRecord: function(clazz, id) {
    var typeKey;
    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    return this.ajax(typeKey + '/' + id, 'DELETE');
  },

  /*
  * Batch Operations:
  *   https://www.parse.com/docs/rest#objects-batch
  * operations: {creates: [], updates: [], destroys: []}, record arrays.
  */
  batch: function(operations) {
    var requests = [],
      records = [],
      __this = this;

    operations.creates = operations.creates || [];
    operations.updates = operations.updates || [];
    operations.destroys = operations.destroys || [];

    // create record
    operations.creates.forEach(function(record){
      requests.push({
        'method': 'POST',
        'path': __this.buildBatchPath(record.getCapitalizeTypeKey()),
        'body': record.get('modelData')
      });
      records.push(record);
    });

    // update record
    operations.updates.forEach(function(record){
      requests.push({
        'method': 'PUT',
        'path': __this.buildBatchPath(record.getCapitalizeTypeKey(), record.get('id')),
        'body': record.get('changeData')
      });
      records.push(record);
    });

    // destroy record
    operations.destroys.forEach(function(record){
      requests.push({
        'method': 'DELETE',
        'path': __this.buildBatchPath(record.getCapitalizeTypeKey(), record.get('id'))
      });
      records.push(record);
    });

    return this.ajax('batch', 'POST', {'data': {'requests': requests}, 'batchRecords': records});
  }
});