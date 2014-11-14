import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'a',
  classNames: ['post-tag'],
  tag: null,

  click: function() {
  },

  didInsertElement: function() {
    this.$().text(this.get('tag.name'));
  }
});