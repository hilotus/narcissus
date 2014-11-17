import NavigatableView from '../navigate/navigatable';
import SettingsOptionsNavigatable from '../../views/settings/options-navigatable';
import SettingsTermsNavigatable from '../../views/settings/terms-navigatable';

import Section from '../../supports/navigate/section';
import SelectRow from '../../supports/navigate/rows/select-row';

export default NavigatableView.extend({
  titleTranslation: 'settings.title',

  hasLeftButton: false,
  hasRightButton: false,

  sections: ["menuSection"],
  menuSection: Section.extend({
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
        controller.push(SettingsTermsNavigatable.extend({type: 'tag'}));
      }
    }),

    category: SelectRow.extend({
      titleTranslation: 'settings.category.title',

      onSelect: function(controller) {
        controller.push(SettingsTermsNavigatable.extend({type: 'category'}));
      }
    })
  })
});
