import Ember from 'ember';

export default Ember.Object.extend({
  /*
  * a navigatable view which contains the row.
  * controller in navigatable view is a navigationController.
  */
  owner: null,

  // a section which contains the row
  section: null,

  store: function() {
    return this.get('owner.controller.store');
  }.property('owner'),

  currentUser: function() {
    return this.get('owner.controller.currentUser');
  }.property('owner'),

  // row type
  type: '',

  isSelect: Ember.computed.equal('type', 'select'),
  isDescription: Ember.computed.equal('type', 'description'),
  isDescriptionUpdate: Ember.computed.equal('type', 'description-update'),
  isTitleUpdate: Ember.computed.equal('type', 'title-update'),
  isSwitch: Ember.computed.equal('type', 'switch'),
  isInput: Ember.computed.equal('type', 'input'),
  isCreateInput: Ember.computed.equal('type', 'create-input'),
  isButton: Ember.computed.equal('type', 'button'),
  isSingleCheck: Ember.computed.equal('type', 'single-check')
});
