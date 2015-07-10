import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['post-tag'],
  content: null,

  click: function() {
  },

  didInsertElement: function() {
    this.$().text(this.get('content.name'));
  }
});
