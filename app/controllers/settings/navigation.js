import NavigationController from 'narcissus/controllers/navigate/navigation';

export default NavigationController.extend({
  needs: ['settings/terms'],

  tagsBinding: 'controllers.settings/terms.tags',
  categoriesBinding: 'controllers.settings/terms.categories',
});