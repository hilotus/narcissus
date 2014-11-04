import Ember from 'ember';
import Alert from 'narcissus/utils/alert';
import SelectRow from '../../supports/navigate/rows/select-row';
import NavigatableView from '../navigate/navigatable';

import SettingsOptionsNavigatable from '../../views/settings/options-navigatable';
import SettingsTermsNavigatable from '../../views/settings/terms-navigatable';

export default NavigatableView.extend({
  titleTranslation: 'settings.title',

  hasLeftButton: false,
  hasRightButton: false,

  sections: ["menuSection"],
  menuSection: Ember.Object.extend({
    titleTranslation: 'settings.sectionheader.option',

    rows: ["mine", "tag", "category"],
    mine: SelectRow.extend({
      titleTranslation: 'settings.mine.title',

      onSelect: function(controller) {
        controller.push(SettingsOptionsNavigatable);
      }
    }),

    tag: SelectRow.extend({
      titleTranslation: 'settings.tag.title',

      onSelect: function(controller) {
        controller.tags().then(function(rels){
          controller.push(SettingsTermsNavigatable.extend({ type: "tag", content: rels }));
        }).catch(function(errorJson){
          Alert.warn(errorJson.error);
        });
      }
    }),

    category: SelectRow.extend({
      titleTranslation: 'settings.category.title',

      onSelect: function(controller) {
        controller.categories().then(function(rels){
          controller.push(SettingsTermsNavigatable.extend({ type: "category", content: rels }));
        }).catch(function(errorJson){
          Alert.warn(errorJson.error);
        });
      }
    })
  })
});
