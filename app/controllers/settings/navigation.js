import NavigationController from '../navigate/navigation';

export default NavigationController.extend({
  tags: function() {
    return this.store.find('Term', {'where': {'type': 'tag'}});
  },

  categories: function() {
    return this.store.find('Term', {'where': {'type': 'category'}});
  },
});
