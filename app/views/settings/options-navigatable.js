import Ember from 'ember';
import Alert from 'narcissus/utils/alert';
import NavigatableView from '../navigate/navigatable';

import DescriptionRow from '../../supports/navigate/rows/description-row';
import SwitchRow from '../../supports/navigate/rows/switch-row';
import DescriptionUpdateRow from '../../supports/navigate/rows/description-update-row';

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
  optionsSection: Ember.Object.extend({
    titleTranslation: 'settings.sectionheader.option',

    rows: ['username','email', 'name', 'demo'],

    username: DescriptionRow.extend({
      titleTranslation: 'settings.mine.username',
      description: Ember.computed.oneWay('currentUser.username')
    }),

    email: DescriptionRow.extend({
      titleTranslation: 'settings.mine.email',
      description: Ember.computed.oneWay('currentUser.email')
    }),

    name: DescriptionUpdateRow.extend({
      titleTranslation: 'settings.mine.name',
      description: Ember.computed.oneWay('currentUser.name'),
      bufferedDescription: Ember.computed.oneWay('currentUser.name'),

      doneEditing: function() {
        var __this = this;
        // update logic
        if (Ember.isEmpty(this.get('bufferedDescription'))) {
          this.set('bufferedDescription', this.get('description'));
        } else if (this.get('description') !== this.get('bufferedDescription')) {
          var user = this.get('currentUser');
          user.setVal('name', this.get('bufferedDescription'));
          user.save().then(function(){
            __this.set('description', __this.get('bufferedDescription'));
          }).catch(function(errorJson){
            Alert.warn(errorJson.error);
          });
        }

        this.set('isEditing', false);
      },
    }),

    demo: SwitchRow.extend()
  })
});
