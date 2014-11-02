import NavigationController from '../navigate/navigation';

export default NavigationController.extend({

  /*
   * For tags and categories manager, reload once from server.
   * http://stackoverflow.com/questions/24792574/ember-data-is-always-fetching-records-for-route
   */
  tags: function() {
    return this.store.find('Term', {'where': {'type': 'tag'}});
  },

  categories: function() {
    return this.store.find('Term', {'where': {'type': 'category'}});
  },
});
