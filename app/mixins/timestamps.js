import Ember from 'ember';

export default Ember.Mixin.create({
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

  // for mongodb
  created_at: Ember.computed('modelData.created_at', function(key, value){
    if (arguments.length < 2) {
      return this.get('modelData.created_at');
    } else {
      if (typeof(value) === 'string') {
        value = new Date(value);
      }
      this.set('modelData.created_at', value);
      return value;
    }
  }),

  // for mongodb
  updated_at: Ember.computed('modelData.updated_at', function(key, value){
    if (arguments.length < 2) {
      return this.get('modelData.updated_at');
    } else {
      if (typeof(value) === 'string') {
        value = new Date(value);
      }
      this.set('modelData.updated_at', value);
      return value;
    }
  }),

  createdAtFormat: function() {
    if (!!this.get("createdAt")) {
      return moment(this.get("createdAt")).fromNow();
    } else {
      return moment(this.get("created_at")).fromNow();
    }
  }.property('createdAt', 'created_at'),

  updatedAtFormat: function() {
    if (!!this.get("updatedAt")) {
      return moment(this.get("updatedAt")).fromNow();
    } else {
      return moment(this.get("updated_at")).fromNow();
    }
  }.property('updatedAt', 'updated_at')
});