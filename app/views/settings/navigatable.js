import NavigatableView from 'ember-cli-coreweb/views/navigate/navigatable';
import SettingsOptionsNavigatable from './options-navigatable';
import SettingsTermsNavigatable from './terms-navigatable';
import SettingsEventsNavigatable from './events-navigatable';

import Section from 'ember-cli-coreweb/supports/navigate/section';
import SelectRow from 'ember-cli-coreweb/supports/navigate/rows/select-row';

export default NavigatableView.extend({
  titleTranslation: 'settings.title',

  hasLeftButton: false,
  hasRightButton: false,

  sections: ["menuSection"],
  menuSection: Section.extend({
    titleTranslation: 'settings.sectionheader.option',

    rows: ["mine", "tag", "category", 'events'],
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
    }),

    events: SelectRow.extend({
      titleTranslation: 'settings.events.title',

      onSelect: function(controller) {
        controller.get('controllers.settings/events').findEvents();
        controller.push(SettingsEventsNavigatable);
      }
    })
  })
});
