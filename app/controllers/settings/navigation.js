import NavigationController from '../navigate/navigation';

export default NavigationController.extend({
  tags: function() {
    return this.store.find('Term', {'where': {'type': 'tag', 'owner': this.get('currentUser.id')}});
  },

  categories: function() {
    return this.store.find('Term', {'where': {'type': 'category', 'owner': this.get('currentUser.id')}});
  },
});
