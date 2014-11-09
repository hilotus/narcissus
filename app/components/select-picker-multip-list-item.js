import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: [':result'],

  attributeBindings: ['style'],
  style: "margin: 5px 6px;padding: 0;",

  isFocus: false,

  // 集合中每个item对象
  content: null,

  mouseEnter: function() {
    this.set('isFocus', true);
    return true;
  },

  mouseLeave: function() {
    this.set('isFocus', false);
    return true;
  },

  /*
    checkbox is selected
    k: value
    v: undefined, true, false
  */
  value: function(k, v) {
    if (v === undefined) {
      return false;
    } else {
      var selection = this.get('parentView.selection'), content = this.get('content');
      if (selection && content) {
        if (v) {
          if (!selection.contains(content)) {
            this.get('parentView.selection').pushObject(content);
          }
        } else {
          if (selection.contains(content)) {
            this.get('parentView.selection').removeObject(content);
          }
        }
      }
      return v;
    }
  }.property(),

  layout: Ember.Handlebars.compile('{{check-box text=content.name value=value isFocus=isFocus}}'),

  didInsertElement: function() {
    var self = this;
    /*
      TODO: 初始化已选中标签，目前使用延迟500毫秒处理
    */
    Ember.run.later(function(){
      var selection = self.get("parentView.selection"), content = self.get("content");
      if (selection && content) {
        self.set("value", selection.contains(content));
      }
    }, 500);
  }
});