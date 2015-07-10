import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['post-category'],
  content: null,

  click: function() {
  },

  didInsertElement: function() {
    this.$().text(this.get('content.name'));
    this.$().css({"background-color": this.get('content.color')});
  }
});
