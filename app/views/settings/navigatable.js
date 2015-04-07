import NavigatableView from 'narcissus/views/navigate/navigatable';
import SettingsOptionsNavigatable from './options-navigatable';
import SettingsTermsNavigatable from './terms-navigatable';

import Section from 'narcissus/supports/navigate/section';
import SelectRow from 'narcissus/supports/navigate/rows/select-row';

export default NavigatableView.extend({
  title: function() {
    var t = this.container.lookup('utils:t');
    return t('settings.title');
  }.property(),

  hasLeftButton: false,
  hasRightButton: false,

  sections: ["menuSection"],
  menuSection: Section.extend({
    title: function() {
      var t = this.get('owner.container').lookup('utils:t');
      return t('settings.section.header.option');
    }.property(),

    rows: ["mine", "tag", "category"],
    mine: SelectRow.extend({
      title: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t('settings.mine.title');
      }.property(),

      onSelect: function(controller) {
        controller.push(SettingsOptionsNavigatable);
      }
    }),

    tag: SelectRow.extend({
      title: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t('settings.tag.title');
      }.property(),

      onSelect: function(controller) {
        controller.push(SettingsTermsNavigatable.extend({type: 'tag'}));
      }
    }),

    category: SelectRow.extend({
      title: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t('settings.category.title');
      }.property(),

      onSelect: function(controller) {
        controller.push(SettingsTermsNavigatable.extend({type: 'category'}));
      }
    })
  })
});
