import Ember from 'ember';
import Alert from 'narcissus/utils/alert';
import NavigatableView from 'ember-cli-coreweb/views/navigate/navigatable';

import Section from 'ember-cli-coreweb/supports/navigate/section';
import DescriptionRow from 'ember-cli-coreweb/supports/navigate/rows/description-row';
import SwitchRow from 'ember-cli-coreweb/supports/navigate/rows/switch-row';
import DescriptionUpdateRow from 'ember-cli-coreweb/supports/navigate/rows/description-update-row';

export default NavigatableView.extend({
  titleTranslation: 'settings.mine.title',

  hasLeftButton: true,
  leftButtonTitleTranslation: 'settings.title',
  actions: {
    leftButtonAction: function(controller) {
      controller.pop();
    },
  },

  sections: ["optionsSection"],
  optionsSection: Section.extend({
    titleTranslation: 'settings.sectionheader.option',

    rows: ['username','email', 'name', 'demo'],

    username: DescriptionRow.extend({
      titleTranslation: 'settings.mine.username',
      description: Ember.computed.oneWay('owner.controller.currentUser.username')
    }),

    email: DescriptionRow.extend({
      titleTranslation: 'settings.mine.email',
      description: Ember.computed.oneWay('owner.controller.currentUser.email')
    }),

    name: DescriptionUpdateRow.extend({
      titleTranslation: 'settings.mine.name',
      description: Ember.computed.oneWay('owner.controller.currentUser.name'),
      bufferedDescription: Ember.computed.oneWay('owner.controller.currentUser.name'),

      doneEditing: function() {
        // update user name logic
        if (Ember.isEmpty(this.get('bufferedDescription'))) {
          this.set('bufferedDescription', this.get('description'));
        } else if (this.get('description') !== this.get('bufferedDescription')) {
          var user = this.get('owner.controller.currentUser');
          user.setVal('name', this.get('bufferedDescription'));
          user.save().catch(function(errorJson){
            Alert.warn(errorJson.error);
          });
        }

        this.set('isEditing', false);
      },
    }),

    demo: SwitchRow.extend()
  })
});
