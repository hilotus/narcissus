import Ember from 'ember';

export default Ember.Mixin.create({
  applicationId: '4f3ATEailRoi1A49sh4vlNppWKk8G8xf6ThymKkG',
  restApiId: 'm2CUMzzcTkqZLTR2v7BVbXLIg9vAzqAxWYVUvyjm',
  javascriptId: '367pi3LgkWvdperJxh0cvGmfjVYSjaS2vs6KbYsU',

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
          Ember.run(null, resolve, json);
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

    if (hash.data) {
      hash.contentType = 'application/json; charset=utf-8';
      if (hash.type !== 'GET') {
        hash.data = JSON.stringify(hash.data);
      }
    }

    hash.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-Parse-Application-Id', adapter.get("applicationId"));
      xhr.setRequestHeader('X-Parse-REST-API-Key', adapter.get("restApiId"));
      if (hash.url.match(/users|roles/) || hash.url.match(/PUT|DELETE/)) {
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

    if (url.match(/users|Password|login/)) {
      return adapter.get('host') + '/' + adapter.get('namespace') + '/' + url;
    } else {
      return adapter.get('host') + '/' + adapter.get('namespace') + '/' + adapter.get('classesPath') + '/' + url;
    }
  }
});
