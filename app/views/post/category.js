import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'a',
  classNames: ['post-category'],
  category: null,
  template: Ember.Handlebars.compile("{{view.category.name}}"),

  click: function() {
  },

  didInsertElement: function() {
    this.$().css({"background-color": this.get('category.color')});
  }
});