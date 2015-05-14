import Ember from 'ember';

export default Ember.Mixin.create({
  applicationId: '',
  restApiKey: '',

  host: "https://api.parse.com",
  namespace: '1',
  classesPath: 'classes',

  sessionToken: "",

  ajax: function(url, type, options) {
    var that = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      var hash = that.ajaxOptions(url, type, options);

      hash.success = function(json, textStatus, jqXHR) {
        json = that.ajaxSuccess(jqXHR, json);
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

      hash.error = function(jqXHR) {
        Ember.run(null, reject, that.ajaxError(jqXHR));
      };

      Ember.$.ajax(hash);
    });
  },

  ajaxOptions: function(url, type, options) {
    var hash = options || {},
      that = this;

    hash.url = that.buildUrl(url);
    hash.type = type.toUpperCase();
    hash.dataType = 'json';
    // hash.xhrFields = { 'withCredentials': true };

    // set acl for normal parse class.
    // if (hash.type.match(/POST/) && hash.data && hash.data.creator) {
    //   hash.data.ACL = {};
    //   hash.data.ACL[hash.data.creator] = {'read': true, 'write': true};
    //   hash.data.ACL['*'] = {'read': true};
    // }

    if (hash.data && type !== 'GET') {
      hash.contentType = 'application/json; charset=utf-8';
      hash.data = JSON.stringify(hash.data);
    }

    hash.beforeSend = function(xhr) {
      xhr.setRequestHeader('X-Parse-Application-Id', that.get("applicationId"));
      xhr.setRequestHeader('X-Parse-REST-API-Key', that.get("restApiKey"));

      /*
      * 1. Validating Session Tokens / Retrieving Current User
      * 2. Updating Users
      * 3. Deleting Users
      */
      if ((hash.url.match(/users\/me/) && hash.type === 'GET') ||
        hash.type.match(/PUT|DELETE/) && hash.url.match(/users/)) {
        xhr.setRequestHeader('X-Parse-Session-Token', that.get('sessionToken'));
      }
    };

    return hash;
  },

  ajaxSuccess: function(jqXHR, jsonPayload) {
    return jsonPayload;
  },

  ajaxError: function(jqXHR) {
    if (jqXHR && typeof jqXHR === 'object') {
      jqXHR.then = null;
    }

    var json = jqXHR.responseJSON;
    if (!Ember.isEmpty(json) && !$.isEmptyObject(json)) {
      return json;
    }

    return {error: jqXHR.statusText + ', (' + jqXHR.status + ')'};
  },

  buildUrl: function(url) {
    var that = this;

    if (url.match(/users|Password|login|batch/)) {
      return that.get('host') + '/' + that.get('namespace') + '/' + url;
    } else {
      return that.get('host') + '/' + that.get('namespace') + '/' + that.get('classesPath') + '/' + url;
    }
  },

  buildBatchPath: function(typeKey, id) {
    return '/' + this.get('namespace') + '/' + this.get('classesPath') + '/' +
      typeKey + (Ember.isBlank(id) ? '' : ('/' + id));
  }
});
