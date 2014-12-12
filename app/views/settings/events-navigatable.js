import Ember from 'ember';
import NavigatableView from 'ember-cli-coreweb/views/navigate/navigatable';

import Section from 'ember-cli-coreweb/supports/navigate/section';
import DateRow from 'ember-cli-coreweb/supports/navigate/rows/date-row';
import TimeRow from 'ember-cli-coreweb/supports/navigate/rows/time-row';
import InputRow from 'ember-cli-coreweb/supports/navigate/rows/input-row';
import ButtonRow from 'ember-cli-coreweb/supports/navigate/rows/button-row';

import EventNavigatable from './event-navigatable';

export default NavigatableView.extend({
  titleTranslation: 'settings.events.title',

  hasLeftButton: true,
  leftButtonTitleTranslation: 'settings.title',
  actions: {
    leftButtonAction: function(controller) {
      controller.pop();
    },
  },

  sections: ["eventsSection", "eventList"],
  eventsSection: Section.extend({
    titleTranslation: 'settings.events.creation',
    controller: Ember.computed.oneWay('owner.controller.controllers.settings/events'),

    rows: ['titleRow', 'date', 'time', 'button'],
    titleRow: InputRow.extend({
      placeholderTranslation: 'settings.events.creation.title',
      valueBinding: 'section.controller.eventTitle'
    }),

    date: DateRow.extend({
      promptTranslation: 'settings.events.date',

      placeholderYearTranslation: 'settings.events.creation.year',
      placeholderMonthTranslation: 'settings.events.creation.month',
      placeholderDayTranslation: 'settings.events.creation.day',

      yearBinding: 'section.controller.year',
      monthBinding: 'section.controller.month',
      dayBinding: 'section.controller.day'
    }),

    time: TimeRow.extend({
      promptTranslation: 'settings.events.time',

      placeholderHourTranslation: 'settings.events.creation.hour',
      placeholderMinuteTranslation: 'settings.events.creation.minute',

      hourBinding: 'section.controller.hour',
      minuteBinding: 'section.controller.minute'
    }),

    button: ButtonRow.extend({
      title: 'create',
      submit: function() {
        this.get('section.controller').createEvent();
      }
    })
  }),

  eventList: Section.extend({
    titleTranslation: 'settings.events.list',
    contentRowTitleBindedName: 'title',
    contentRowType: 'title-select',
    controller: Ember.computed.oneWay('owner.controller.controllers.settings/events'),
    contentBinding: 'controller.model',

    rowOnSelect: function(row) {
      this.get('owner.controller').push(EventNavigatable.extend({eventRecord: row.get('record')}));
    }
  })
});
