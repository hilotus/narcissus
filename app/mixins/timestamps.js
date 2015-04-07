import Ember from 'ember';

export default Ember.Mixin.create({
  createdAtFormat: function() {
    return moment(this.get('createdAt')).fromNow();
  }.property('createdAt'),

  updatedAtFormat: function() {
    return moment(this.get('updatedAt')).fromNow();
  }.property('updatedAt'),
});
