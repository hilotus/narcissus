import Ember from 'ember';

export default Ember.Mixin.create({
  applicationId: '4f3ATEailRoi1A49sh4vlNppWKk8G8xf6ThymKkG',
  restApiKey: 'm2CUMzzcTkqZLTR2v7BVbXLIg9vAzqAxWYVUvyjm',
  masterKey: 'CSLMenf3XKL4a9fjUmwB7ExiXiTXLkQz5KTC3Ey5',

  host: "https://api.parse.com",
  namespace: '1',
  classesPath: 'classes',

  sessionToken: "",

  ajax: function(url, type, options) {
    var adapter = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var hash = adapter.ajaxOptions(url, type, options);

      hash.success = function(json, textStatus, jqXHR) {
        json = adapter.ajaxSuccess(jqXHR, json);
        if (json instanceof Error) {
          Ember.run(null, reject, json);
        } else {
          if (!!options && !!options.batchRecords) {
            Ember.run(null, resolve, {'responseJson': json, 'batchRecords': options.batchRecords});
          } else {
            Ember.run(null, resolve, json);
          }
        }
      };

      hash.error = function(jqXHR, textStatus, errorThrown) {
        Ember.run(null, reject, adapter.ajaxError(jqXHR, jqXHR.responseText));
      };

      Ember.$.ajax(hash);
    });
  },

  ajaxOptions: function(url, type, options) {
    var hash = options || {},
      adapter = this;

    hash.url = adapter.buildUrl(url);
    hash.type = type.toUpperCase();
    hash.dataType = 'json';
    // hash.xhrFields = { 'withCredentials': true };

    if (hash.data && hash.type !== 'GET') {
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(hash.data);
    }

    hash.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-Parse-Application-Id', adapter.get("applicationId"));
      xhr.setRequestHeader('X-Parse-REST-API-Key', adapter.get("restApiKey"));

      /*
      * 1. Validating Session Tokens / Retrieving Current User
      * 2. Updating Users
      * 3. Deleting Users
      */
      if ((hash.url.match(/users\/me/) && hash.type === 'GET') ||
        hash.type.match(/PUT|DELETE/) && hash.url.match(/users/)) {
        xhr.setRequestHeader('X-Parse-Session-Token', adapter.get('sessionToken'));
      }
    };

    return hash;
  },

  ajaxSuccess: function(jqXHR, jsonPayload) {
    return jsonPayload;
  },

  ajaxError: function(jqXHR, responseText) {
    if (jqXHR && typeof jqXHR === 'object') {
      jqXHR.then = null;
    }

    return jqXHR;
  },

  buildUrl: function(url) {
    var adapter = this;

    if (url.match(/users|Password|login|batch/)) {
      return adapter.get('host') + '/' + adapter.get('namespace') + '/' + url;
    } else {
      return adapter.get('host') + '/' + adapter.get('namespace') + '/' + adapter.get('classesPath') + '/' + url;
    }
  },

  buildBatchPath: function(typeKey, id) {
    return '/' + this.get('namespace') + '/' + this.get('classesPath') + '/' +
      typeKey + (Ember.isBlank(id) ? '' : ('/' + id));
  }
});