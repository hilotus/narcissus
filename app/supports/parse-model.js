import Ember from 'ember';

var ParseModel = Ember.Object.extend({
  init: function() {
    this._super();
    this.set('modelData', {});
    this.set('changeData', {});
  },

  store: null,

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

    var self = this;
    for(var key in values) {
      self.setVal(key, values[key]);
    }
    return self;
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

  isChanged: function() {
    var changes = this.getChanges();
    return !$.isEmptyObject(changes);
  }.property(),

  getChanges: function() {
    var belongTo = [], hasMany = [],
      self = this,
      changed = false,
      changes = {},
      tmpValue, tmpArr, tmpDataArr;

    $.each(this.constructor.schema.belongTo, function(k){
      belongTo.push(k);
    });
    $.each(this.constructor.schema.hasMany, function(k){
      hasMany.push(k);
    });

    $.each(this.get('modelData'), function(key, value){
      if (belongTo.contains(key)) {
        changed = self.get(key + '.id') !== self.get('modelData.%@'.fmt(key))
        tmpValue = self.get(key + '.id')
      } else if (hasMany.contains(key)) {
        tmpArr = self.get(key).getIds();
        tmpDataArr = self.get('modelData.%@'.fmt(key));
        // returns true, both the arrays are same even if the elements are in different order.
        changed = !($(tmpArr).not(tmpDataArr).length === 0 && $(tmpDataArr).not(tmpArr).length === 0)
      } else {
        changed = self.get(key) !== self.get('modelData.%@'.fmt(key))
        tmpValue = self.get(key)
      }

      if (changed) {
        changes[key] = tmpValue;
        // this.set('changeData.%@'.fmt(key), tmpValue);
      }

      changed = false;
    });

    return changes;
  },

  clearChanges: function() {
    this.set('changeData', {});
  },

  /*
  * discard all changes
  */
  discardChanges: function() {
    this.get('store').__normalize(this, this.get('modelData'));
  },

  /*
  * commit all changes
  */
  commitChanges: function() {
    if (!this.get('isPersistent')) {
      this.discardChanges();
      throw new Error('You can not commit an unpersistent record.');
    }

    // this.clearChanges();
    var changes = this.getChanges();
    if (!$.isEmptyObject(changes)) {
      this.set('changeData', changes);
      return this.save();
    }
    return Ember.RSVP.reject({error: 'There are no changes.'});
  },

  /*
  * setVal, then save changes
  */
  save: function() {
    if (this.get('isDistroyed')) {
      throw new Error('You can not save distroyed record.');
    }

    var clazz = this.constructor,
      self = this;

    if (this.get('isNew')) {
      return this.store.createRecord(clazz, this.get('modelData')).then(function(json){
        // push to store
        self.store.push(clazz, json, self);
        return Ember.RSVP.resolve(self);
      }, function(reason){
        return Ember.RSVP.reject(reason);
      });
    } else {
      return this.store.updateRecord(clazz, this.get('id'), this.get('changeData')).then(function(json){
        // relaod from store
        self.store.reload(self.getTypeKey(), json, self);
        return Ember.RSVP.resolve(self);
      }, function(reason){
        // if error occurred, rollback the changes.
        self.discardChanges();
        return Ember.RSVP.reject(reason);
      });
    }
  },

  /*
  * Destroy
  */
  destroyRecord: function() {
    var store = this.get('store'),
      clazz = this.constructor,
      self = this;

    return store.destroyRecord(clazz, self.get('id')).then(function(){
      self.set('status', 'distroyed');
      store.pull(self.getTypeKey(), self.get('id'));
      return Ember.RSVP.resolve();
    }, function(reason){
      return Ember.RSVP.reject(reason);
    });
  }
});

ParseModel.reopenClass({
  typeKey: '',
  schema: {
    'belongTo': {},
    'hasMany': {}
  }
});

export default ParseModel;
