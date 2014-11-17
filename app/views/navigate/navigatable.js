import Ember from 'ember';

export default Ember.View.extend({
  templateName: 'navigate/navigatable',
  classNames: ['navigatable'],

  title: "",

  hasLeftButton: false,
  leftButtonTitle: "",

  hasRightButton: false,
  rightButtonTitle: "",

  actions: {
    leftButtonAction: function(){},
    rightButtonAction: function(){},
  },

  sections: [],

  sectionsView: function() {
    var __this = this;
    return this.get('sections').map(function(section){
      return __this.get(section).create({'owner': __this});
    });
  }.property('sections.length')
});
