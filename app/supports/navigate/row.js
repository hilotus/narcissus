import Ember from 'ember';

export default Ember.Object.extend({
  type: "",
  // a navigatable view which contains the row
  owner: null,
  store: null,
  currentUser: null,

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
});