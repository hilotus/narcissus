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

  isSelect: function() {
    return this.get("type") === "select";
  }.property("type"),

  isDescription: function() {
    return this.get("type") === "description";
  }.property("type"),

  isDescriptionUpdate: function() {
    return this.get('type') === "description-update";
  }.property('type'),

  isTitleUpdate: function() {
    return this.get('type') === "title-update";
  }.property('type'),

  isSwitch: function() {
    return this.get('type') === "switch";
  }.property("type"),

  isInput: function() {
    return this.get('type') === "input";
  }.property("type"),

  isCreateInput: function() {
    return this.get('type') === "create-input";
  }.property("type"),

  isButton: function() {
    return this.get('type') === "button";
  }.property("type"),

  isDate: function() {
    return this.get('type') === "date";
  }.property('type'),

  isTime: function() {
    return this.get('type') === "time";
  }.property('type'),

  isTitleSelect: function() {
    return this.get('type') === 'title-select';
  }.property('type')
});