import Ember from 'ember';

export default Ember.Mixin.create({
  // host: "http://localhost:3000",
  // host: "http://10.63.88.84:3000",
  host: "http://reminderws.hilotus.com",
  namespace: 'v1',

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

      hash.beforeSend = function(xhr) {
        /*
        * 1. Validating Session Tokens / Retrieving Current User
        * 2. Updating Users
        * 3. Deleting Users
        */
        if ((hash.url.match(/users\/me/) && hash.type === 'GET') ||
          (hash.type.match(/PUT|DELETE/) && hash.url.match(/users/)) ||
          hash.url.match(/getToken/)) {
          xhr.setRequestHeader('X-Reminder-Session-Token', adapter.get('sessionToken'));
        }
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

    if (hash.data && hash.type !== 'GET') {
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(hash.data);
    }

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
    return this.get('host') + '/api/' + this.get('namespace') + '/' + url;
  },

  buildBatchPath: function(typeKey, id) {
    return '/' + this.get('namespace') + '/' + this.get('classesPath') + '/' +
      typeKey + (Ember.isBlank(id) ? '' : ('/' + id));
  }
});