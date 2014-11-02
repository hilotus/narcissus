import Ember from 'ember';
import ParseAjax from 'narcissus/mixins/parse-ajax';

export default Ember.Object.extend(ParseAjax, {
  /*
  * clazz: model class
  * id: is a string or a query json
  * https://www.parse.com/docs/rest#queries-compound
  */
  find: function(clazz, id) {
    var typeKey, query = this._buildQuery(id);

    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    if (typeKey === 'User') {
      typeKey = '_' + typeKey;
    }

    return this.ajax(typeKey, "GET", {'data': query});
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
  distroyRecord: function(clazz, id) {
    var typeKey;
    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    return this.ajax(typeKey + '/' + id, 'DELETE');
  },

  /*
  * Build Query Conditions.
  */
  _buildQuery: function(id) {
    var query = {};

    if (typeof(id) === 'string') {
      query.where = {'objectId': id};
    } else {
      // pagenite feature
      if (id.limit && id.skip) {
        query.limit = id.limit;
        query.skip = id.skip;
        delete id.limit;
        delete id.skip;
      }

      // return records count
      if (id.count) {
        query.count = id.count;
        delete id.count;
      }

      // query order by
      if (id.order) {
        query.order = id.order;
        delete id.order;
      }

      query.where = id.where;
    }

    return query;
  }
});