import Ember from 'ember';

export default Ember.TextField.extend({
  // press Enter key
  insertNewline: function() {
    this.get('target').doneEditing();
  },

  // lose focus
  focusOut: function() {
    this.get('target').cancelEditing();
  },

  // press Esc key
  cancel: function() {
    this.get('target').cancelEditing();
  },

  // after view generat
  didInsertElement: function() {
    this.$().focus();
  }
});
