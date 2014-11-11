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

  format: "LLL",
  createdAtFormat: function() {
    return moment(this.get("createdAt")).format(this.get("format"));
  }.property('format', 'createdAt'),

  updatedAtFormat: function() {
    return moment(this.get("updatedAt")).format(this.get("format"));
  }.property('format', 'updatedAt')
});