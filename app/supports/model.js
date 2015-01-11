import Ember from 'ember';
import Timestamps from '../mixins/timestamps';

/*
* how to use model
*
* var m = Model.create();
* m.setVal('name', 'wluo');  ==> this will save name in modelData;
* m.save();  ==> then, the name will save in model as a property.
*
* var m = store.find('modelType', id);
* m.setVal('name', 'wluo11'); ==> this will save name in changeData and modelData.name is wluo11,
*                                 but m.get('name') is wluo.
* m.save();  ==> then changeData is empty, and m.get('name') is wluo11
*
*
* It's important!!!
* All of above, only after saving success, we will update model instance properties.
*/
var Model = Ember.Object.extend(Timestamps, {
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
  * merge diffrences between server and modelData after create or update.
  * call after find and save
  *
  * you can see in store.js
  */
  merge: function(json) {
    Ember.merge(this.get('modelData'), json);
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

    // when the status is persistent, only after saving success, update the changes to modelData.
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
    return this.get('modelData.%@'.fmt(keyName));
  },

  // return post
  getTypeKey: function() {
    return this.constructor.typeKey;
  },

  // return Post
  getCapitalizeTypeKey: function() {
    return this.constructor.typeKey.capitalize();
  },

  clearChanges: function() {
    this.set('changeData', {});
  },

  /*
  * discard all changes before save.
  */
  discardChanges: function() {
    this.get('store').normalize(this, this.get('modelData'));
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
        store._push(clazz, responseJson, __this);
        return Ember.RSVP.resolve(__this);
      }, function(errorJson){
        return Ember.RSVP.reject(errorJson);
      });
    } else {
      return store.updateRecord(clazz, this.get('id'), this.get('changeData')).then(function(responseJson){
        store._reload(__this.getTypeKey(), responseJson, __this);
        return Ember.RSVP.resolve(__this);
      }, function(errorJson){
        return Ember.RSVP.reject(errorJson);
      });
    }
  },

  destroyRecord: function() {
    var store = this.get('store'),
      clazz = this.constructor,
      __this = this;

    return store.destroyRecord(clazz, __this.get('id')).then(function(){
      __this.set('status', 'distroyed');
      store._pull(__this.getTypeKey(), __this.get('id'));
      return Ember.RSVP.resolve();
    }, function(errorJson){
      return Ember.RSVP.reject(errorJson);
    });
  }
});

Model.reopenClass({
  typeKey: '',
  schema: {
    'belongTo': {},
    'hasMany': {}
  }
});

export default Model;