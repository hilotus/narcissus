import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['search'],
  templateName: 'posts-search',

  keywords: "",

  keyDown: function(evt) {
    var keywords = this.get('keywords');
    if (evt.keyCode === 13 && keywords !== this.get('controller.keywords')) {
      this.set('controller.keywords', keywords);
    }
  },

  keyUp: function(evt) {
    // 当keywords为空时，自动搜索出全部
    if (evt.keyCode === 8 || evt.keyCode === 46) {  // 退格键，Delete键
      var keywords = this.get('keywords');
      if (!keywords) {
        this.set('controller.keywords', keywords);
      }
    }
  }
});