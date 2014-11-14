import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  // layoutName: 'select-picker-single-list-item',
  classNameBindings: [':result', ':not-multiple', 'isMouseEnter:highlighted', 'isSelected:selected'],
  isMouseEnter: false,

  // item object
  content: null,

  mouseEnter: function() {
    this.set('isMouseEnter', true);
    return true;
  },

  mouseLeave: function() {
    this.set('isMouseEnter', false);
    return true;
  },

  isSelected: function() {
    return this.get('content') && this.get('content.id') === this.get('parentView.selection.id');
  }.property('parentView.selection.id'),

  click: function() {
    var content = this.get('content');
    this.set('parentView.isActive', false);
    this.set('parentView.selection', this.get('isSelected') ? null : content);
    return true;
  }
});