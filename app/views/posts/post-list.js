import Ember from 'ember';
import Scrolling from '../../mixins/scrolling';

export default Ember.CollectionView.extend(Scrolling, {
  classNames: ["list-article"],
  content: null,

  didInsertElement: function() {
    this.bindScrolling();
  },

  willDestroyElement: function() {
    this.unbindScrolling();
  },

  scrolled: function() {
    // scroll to bottom, then retrieves new posts
    if (($(window).scrollTop() + $(window).height()) === $(document).height()) {
      // view controller is current controller
      this.get('controller').paginate();
    }
  },

  itemViewClass: Ember.View.extend({
    classNames: ["pure-g"],
    templateName: 'posts/post-list-item'
  })
});