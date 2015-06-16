import Ember from 'ember';
import NavigatableView from 'narcissus/views/navigate/navigatable';

import Section from 'narcissus/supports/navigate/section';
import DescriptionRow from 'narcissus/supports/navigate/rows/description-row';
import SwitchRow from 'narcissus/supports/navigate/rows/switch-row';
import DescriptionUpdateRow from 'narcissus/supports/navigate/rows/description-update-row';

export default NavigatableView.extend({
  title: function() {
    var t = this.container.lookup('utils:t');
    return t('settings.mine.title');
  }.property(),

  hasLeftButton: true,
  leftButtonTitle: function() {
    var t = this.container.lookup('utils:t');
    return t('settings.title');
  }.property(),
  leftButtonAction: function() {
    this.container.lookup('controller:settings/navigation').pop();
  },

  sections: ["optionsSection"],
  optionsSection: Section.extend({
    title: function() {
      var t = this.get('owner.container').lookup('utils:t');
      return t('settings.section.header.option');
    }.property(),

    rows: ['username','email', 'name', 'demo'],

    username: DescriptionRow.extend({
      title: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t('settings.mine.username');
      }.property(),
      description: Ember.computed.oneWay('owner.controller.currentUser.username')
    }),

    email: DescriptionRow.extend({
      title: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t('settings.mine.email');
      }.property(),
      description: Ember.computed.oneWay('owner.controller.currentUser.email')
    }),

    name: DescriptionUpdateRow.extend({
      title: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t('settings.mine.name');
      }.property(),
      description: Ember.computed.oneWay('owner.controller.currentUser.name'),
      bufferedDescription: Ember.computed.oneWay('owner.controller.currentUser.name'),

      doneEditing: function() {
        // update user name logic
        if (Ember.isEmpty(this.get('bufferedDescription'))) {
          this.set('bufferedDescription', this.get('description'));
        } else if (this.get('description') !== this.get('bufferedDescription')) {
          var t = this.get('owner.container').lookup('utils:t'),
            alert = this.get('owner.container').lookup('modal:alert'),
            user = this.get('owner.controller.currentUser');

          user.setVal('name', this.get('bufferedDescription'));
          user.save().catch(function(reason){
            alert(t('ajax.error.operate'), reason.error, 'error');
          });
        }

        this.set('isEditing', false);
      },
    }),

    demo: SwitchRow.extend()
  })
});
