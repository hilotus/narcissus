import Ember from 'ember';
import BaseUtil from 'narcissus/utils/base';
import NavigatableView from 'narcissus/views/navigate/navigatable';

import Section from 'narcissus/supports/navigate/section';
import CreateInputRow from 'narcissus/supports/navigate/rows/create-input-row';

export default NavigatableView.extend({
  type: '',

  title: function() {
    var t = this.container.lookup('utils:t');
    return t("settings.%@.title".fmt(this.get("type")));
  }.property('type'),

  hasLeftButton: true,
  leftButtonTitle: function() {
    var t = this.container.lookup('utils:t');
    return t('settings.title');
  }.property(),
  actions: {
    leftButtonAction: function(controller) {
      controller.pop();
    },
  },

  sections: ["termsSection"],
  termsSection: Section.extend({
    controller: Ember.computed.oneWay('owner.controller.controllers.settings/terms'),

    title: function() {
      var t = this.get('owner.container').lookup('utils:t');
      return t("settings.%@.header".fmt(this.get('owner.type')));
    }.property('owner.type'),

    rows: ["createInput"],
    createInput: CreateInputRow.extend({
      bindedName: 'name',
      bindedModel: 'term',

      placeholder: function() {
        var t = this.get('owner.container').lookup('utils:t');
        return t("settings.%@.create".fmt(this.get('owner.type')));
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
