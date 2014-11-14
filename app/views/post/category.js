import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'a',
  classNames: ['post-category'],
  category: null,

  click: function() {
  },

  didInsertElement: function() {
    this.$().text(this.get('category.name'));
    this.$().css({"background-color": this.get('category.color')});
  }
});