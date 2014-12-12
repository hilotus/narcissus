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

  format: "LLL",
  createdAtFormat: function() {
    if (!!this.get("createdAt")) {
      return moment(this.get("createdAt")).format(this.get("format"));
    } else {
      return moment(this.get("created_at")).format(this.get("format"));
    }
  }.property('format', 'createdAt', 'created_at'),

  updatedAtFormat: function() {
    if (!!this.get("updatedAt")) {
      return moment(this.get("updatedAt")).format(this.get("format"));
    } else {
      return moment(this.get("updated_at")).format(this.get("format"));
    }
  }.property('format', 'updatedAt', 'updated_at')
});