import Ember from 'ember';

import TitleUpdateRow from './rows/title-update-row';
import TitleSelectRow from './rows/title-select-row';

export default Ember.Object.extend({
  owner: null,

  title: '',

  rows: [],

  commonRows: function() {
    var __this = this;
    return this.get('rows').map(function(row){
      return __this.get(row).create({
        'owner': __this.get('owner'),
        'section': __this
      });
    });
  }.property('rows.length'),

  // for rowCollection generate
  content: [],

  contentRowTitleBindedName: 'name',
  contentRowType: '',

  contentRows: function() {
    var __this = this;
    return this.get('content').map(function(record){
      return __this._createContentRow(record, __this);
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
  _createContentRow: function(record, section) {
    var type = section.get('contentRowType');
    if (type === 'title-select') {
      return TitleSelectRow.extend({
        section: section,
        owner: section.get('owner'),
        record: record,

        init: function() {
          this.set('title', this.get('record.%@'.fmt(this.get('section.contentRowTitleBindedName'))));
          this._super();
        },

        onSelect: function() {
          this.get('section').rowOnSelect(this);
        }
      }).create();
    } else {
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
  }
});