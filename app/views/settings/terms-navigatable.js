import Ember from 'ember';
import BaseUtil from '../../utils/base';

import NavigatableView from '../navigate/navigatable';

import CreateInputRow from '../../supports/navigate/rows/create-input-row';
import TitleUpdateRow from '../../supports/navigate/rows/title-update-row';

export default NavigatableView.extend({
  type: '',
  title: function() {
    return Ember.I18n.t("settings.%@.create".fmt(this.get("type")));
  }.property('type'),

  hasLeftButton: true,
  leftButtonTitleTranslation: 'settings.title',
  actions: {
    leftButtonAction: function(controller) {
      controller.pop();
    },
  },

  sections: ["termsSection"],
  termsSection: Ember.Object.extend({
    title: function() {
      return Ember.I18n.t("settings.%@.list".fmt(this.get('owner.type')));
    }.property('owner.type'),

    rows: ["createInput"],
    createInput: CreateInputRow.extend({
      bindedName: 'name',
      bindedModel: 'term',

      placeholder: function() {
        return Ember.I18n.t('settings.%@.create'.fmt(this.get('owner.type')));
      }.property('owner.type'),

      defaultValue: function() {
        return {
          'type': this.get('owner.type'),
          'owner': this.get('currentUser.id'),
          'color': BaseUtil.color()
        };
      }.property('bindedModel', 'bindedName'),

      onCreateSuccess: function(self, newRecord) {
        self.get("owner.content").pushObject(newRecord);
        self.get("owner").rerender();
      },
    }),

    rowCollection: function() {
      var rows = [];
      this.get("owner.content").forEach(function(term){
        rows.pushObject(TitleUpdateRow.extend({
          record: term,
          canDelete: true,
          title: Ember.computed.oneWay('record.name'),
          bufferedTitle: Ember.computed.oneWay('record.name'),
          // which column binded to title
          bindedName: 'name',

          onDeletedSuccess: function(self){
            self.get("owner.content").removeObject(self.get('record'));
            self.get("owner").rerender();
          },
        }));
      });
      return rows;
    }.property('owner.content.length')
  })
});
