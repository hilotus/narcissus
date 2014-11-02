import Ember from 'ember';

export default Ember.TextField.extend({
  // press Enter key
  insertNewline: function() {
    this.get('target').createRecord(this.get("value"));
    this.set("value", '');
  },

  becomeFocus: function() {
  }.on('didInsertElement')
});
