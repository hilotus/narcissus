import Ember from 'ember';
import ParseAjax from 'narcissus/mixins/parse-ajax';

export default Ember.Object.extend(ParseAjax, {
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
  distroyRecord: function(clazz, id) {
    var typeKey;
    if (typeof(clazz) === 'string') {
      typeKey = clazz.capitalize();
    } else {
      typeKey = clazz.typeKey.capitalize();
    }

    return this.ajax(typeKey + '/' + id, 'DELETE');
  }
});