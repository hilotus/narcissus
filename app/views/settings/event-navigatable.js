import Ember from 'ember';
import NavigatableView from 'ember-cli-coreweb/views/navigate/navigatable';

import Section from 'ember-cli-coreweb/supports/navigate/section';
import DescriptionRow from 'ember-cli-coreweb/supports/navigate/rows/description-row';

export default NavigatableView.extend({
  eventRecord: null,

  title: Ember.computed.oneWay('eventRecord.title'),

  hasLeftButton: true,
  leftButtonTitleTranslation: 'settings.events.title',
  actions: {
    leftButtonAction: function(controller) {
      controller.pop();
    },
  },

  sections: ['eventsSection'],
  eventsSection: Section.extend({
    titleTranslation: 'settings.event.details',
    rows: ['datetimeRow'],

    datetimeRow: DescriptionRow.extend({
      titleTranslation: 'settings.events.date',
      description: Ember.computed.oneWay('owner.eventRecord.datetime'),
    })
  })
});