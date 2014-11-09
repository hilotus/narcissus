import Ember from 'ember';

/*
* how to use model
*
* var m = Model.create();
* m.setVal('name', 'wluo');  ==> this will save name in modalData;
* m.save();  ==> then, the name will save in model as a property.
*
* var m = store.find('modelType', id);
* m.setVal('name', 'wluo11'); ==> this will save name in changeData and modalData.name is wluo11,
*                                 but m.get('name') is wluo.
* m.save();  ==> then changeData is empty, and m.get('name') is wluo11
*
*
* It's important!!!
* All of above, only after saving success, we will update model instance properties.
*/
export default Ember.Object.extend({
  init: function() {
    this._super();
    this.set('modelData', {});
    this.set('changeData', {});
  },

  status: 'new',
  isNew: function() {
    return this.get('status') === 'new';
  }.property('status'),
  isPersistent: function() {
    return this.get('status') === 'persistent';
  }.property('status'),
  isDistroyed: function() {
    return this.get('status') === 'distroyed';
  }.property('status'),

  /*
  * only call it after store.find, make sure the Model instance's status is persistent.
  *
  * you can see in store.js
  */
  pushData: function(data) {
    Ember.merge(this.get('modelData'), data);
    for(var key in this.get('modelData')) {
      this.set(key, this.get('modelData')[key]);
    }

    this.clearChanges();
    this.set('status', 'persistent');
  },

  setVal: function(keyName, value) {
    if (this.get('isDistroyed')) {
      throw new Error('You can not set value for distroyed record.');
    }

    /*
    * 1. value is a Model instance, get value's id
    * 2. value is a Array, get it's element(ids) array.
    */
    var v = value;
    if (value instanceof Ember.Object) {
      v = value.get('id');
    } else if (Ember.isArray(value)) {
      v = value.getIds();
    }

    // when the status is persistent, only after saving success, update the changes to modalData.
    if (this.get('isPersistent')) {
      this.set('changeData.%@'.fmt(keyName), v);
    } else {
      this.set('modelData.%@'.fmt(keyName), v);
    }

    return this;
  },

  setVals: function(values) {
    if (this.get('isDistroyed')) {
      throw new Error('You can not set value for distroyed record.');
    }

    var __this = this;
    for(var key in values) {
      __this.setVal(key, values[key]);
    }
    return __this;
  },

  getVal: function(keyName) {
    return this.get(keyName) || this.get('modelData.%@'.fmt(keyName));
  },

  // merge diffrences between server and modelData after create or update.
  merge: function(json) {
    for (var keyName in json) {
      if (!Ember.isEqual(this.get(keyName), json[keyName])) {
        this.setVal(keyName, json[keyName]);
      }
    }

    // after updating modaldata, update it into model instance.
    this.setProperties(this.get('modelData'));

    this.clearChanges();
    this.set('status', 'persistent');
    return this;
  },

  changes: function() {
    this.get('changeData');
  },

  clearChanges: function() {
    this.set('changeData', {});
  },

  save: function() {
    if (this.get('isDistroyed')) {
      throw new Error('You can not save distroyed record.');
    }

    var store = this.get('store'),
      clazz = this.constructor,
      __this = this;

    if (this.get('isNew')) {
      return store.createRecord(clazz, this.get('modelData')).then(function(responseJson){
        __this.merge(responseJson);

        store._push(clazz, __this);
        return Ember.RSVP.resolve(__this);
      }, function(errorJson){
        return Ember.RSVP.reject(errorJson || {'error': 'createRecord error'});
      });
    } else {
      return store.updateRecord(clazz, this.get('id'), this.get('changeData')).then(function(responseJson){
        // update changeData
        Ember.merge(__this.get('changeData'), responseJson);
        __this.merge(responseJson);

        store._reload(clazz, __this, __this.get('id'));
        return Ember.RSVP.resolve(__this);
      }, function(errorJson){
        return Ember.RSVP.reject(errorJson || {'error': 'updateRecord error'});
      });
    }
  },

  destroyRecord: function() {
    var store = this.get('store'),
      clazz = this.constructor,
      __this = this;

    return store.distroyRecord(clazz, __this.get('id')).then(function(){
      __this.set('status', 'distroyed');
      store._pull(clazz, __this.get('id'));
      return Ember.RSVP.resolve();
    }, function(errorJson){
      return Ember.RSVP.reject(errorJson || {'error': 'destroyRecord error'});
    });
  },

  /*
  * timestamps
  */
  createdAt: Ember.computed('modelData.createdAt', function(key, value){
    if (arguments.length < 2) {
      return this.get('modelData.createdAt');
    } else {
      if (typeof(value) === 'string') {
        value = new Date(value);
      }
      this.set('modelData.createdAt', value);
      return value;
    }
  }),

  updatedAt: Ember.computed('modelData.updatedAt', function(key, value){
    if (arguments.length < 2) {
      return this.get('modelData.updatedAt');
    } else {
      if (typeof(value) === 'string') {
        value = new Date(value);
      }
      this.set('modelData.updatedAt', value);
      return value;
    }
  }),

  format: "LLL",
  createdAtFormat: function() {
    var user = this.get('container').lookup("user:current"),
      locale = 'zh-cn';

    if (!Ember.empty(user) && !Ember.empty(user.get('locale'))) {
      locale = user.get('locale');
    }

    return moment(this.get("createdAt")).localeData(locale).format(this.get("format"));
  }.property('format', 'createdAt'),

  updatedAtFormat: function() {
    var user = this.get('container').lookup("user:current"),
      locale = 'zh-cn';

    if (!Ember.empty(user) && !Ember.empty(user.get('locale'))) {
      locale = user.get('locale');
    }

    return moment(this.get("updatedAt")).localeData(locale).format(this.get("format"));
  }.property('format', 'updatedAt')
});