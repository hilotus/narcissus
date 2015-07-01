import Ember from 'ember';

import TitleUpdateRow from './rows/title-update-row';

export default Ember.Object.extend({
  owner: null,

  title: '',

  rows: [],

  commonRows: function() {
    var self = this;
    return this.get('rows').map(function(row){
      return self.get(row).create({
        'owner': self.get('owner'),
        'section': self
      });
    });
  }.property('rows.length'),

  // for rowCollection generate
  content: [],

  contentRowTitleBindedName: 'name',

  contentRows: function() {
    var self = this;
    return this.get('content').map(function(record){
      return self.__createContentRow(record, self);
    });
  }.property('content.length'),

  rowsView: function() {
    var results = [];

    results.pushObjects(this.get('commonRows'));
    results.pushObjects(this.get('contentRows'));

    return results;
  }.property('commonRows.length', 'contentRows.length'),

  /*
  * You can override this method to be dead against your logic specially.
  */
  __createContentRow: function(record, section) {
    return TitleUpdateRow.extend({
      section: section,
      owner: section.get('owner'),
      record: record,

      canDelete: true,

      init: function() {
        this.set('bindedName', this.get('section.contentRowTitleBindedName'));
        this.set('title', this.get('record.%@'.fmt(this.get('section.contentRowTitleBindedName'))));
        this.set('bufferedTitle', this.get('record.%@'.fmt(this.get('section.contentRowTitleBindedName'))));
        this._super();
      },

      onDeletedSuccess: function(row){
        if (row.get('owner.type') === 'tag') {
          row.get("owner.controller.tags").removeObject(row.get('record'));
        } else {
          row.get("owner.controller.categories").removeObject(row.get('record'));
        }
      },
    }).create();
  }
});