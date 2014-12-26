import NavigationController from 'ember-cli-coreweb/controllers/navigate/navigation';

export default NavigationController.extend({
  needs: ['settings/terms'],

  tagsBinding: 'controllers.settings/terms.tags',
  categoriesBinding: 'controllers.settings/terms.categories',
});