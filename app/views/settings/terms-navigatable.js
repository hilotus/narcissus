import Ember from 'ember';
import BaseUtil from '../../utils/base';
import NavigatableView from 'ember-cli-coreweb/views/navigate/navigatable';

import Section from 'ember-cli-coreweb/supports/navigate/section';
import CreateInputRow from 'ember-cli-coreweb/supports/navigate/rows/create-input-row';

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
  termsSection: Section.extend({
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
          'creator': this.get('currentUser.id'),
          'color': BaseUtil.color()
        };
      }.property('bindedModel', 'bindedName'),

      onCreateSuccess: function(row, newRecord) {
        if (row.get('owner.type') === 'tag') {
          row.get("owner.controller.tags").pushObject(newRecord);
        } else {
          row.get("owner.controller.categories").pushObject(newRecord);
        }
      }
    }),

    content: function() {
      if (this.get('owner.type') === 'tag') {
        return this.get('owner.controller.tags');
      } else {
        return this.get('owner.controller.categories');
      }
    }.property('owner.type', 'owner.controller.tags.length', 'owner.controller.categories.length'),

  })
});
