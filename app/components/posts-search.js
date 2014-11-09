import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['search'],
  layoutName: 'posts-search',

  // there is no controller in component, so we will bind target with current controller.
  target: null,
  keywords: "",

  keyDown: function(evt) {
    var keywords = this.get('keywords');
    if (evt.keyCode === 13 && keywords !== this.get('target.keywords')) {
      this.set('target.keywords', keywords);
    }
  },

  keyUp: function(evt) {
    // 当keywords为空时，自动搜索出全部
    if (evt.keyCode === 8 || evt.keyCode === 46) {  // 退格键，Delete键
      var keywords = this.get('keywords');
      if (!keywords) {
        this.set('target.keywords', keywords);
      }
    }
  }
});