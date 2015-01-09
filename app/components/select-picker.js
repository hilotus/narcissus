import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'select-picker',
  classNameBindings: [":select-picker", ":pure-u-1", "isActive:select-picker-active"],
  isActive: false,

  // placeholder title
  prompt: "",

  // all elements
  content: null,
  isMultiple: false,

  keywords: "",
  searchContent: null,
  selection: [],

  title: function() {
    if (this.get('isMultiple')) {
      var selection = this.get('selection');
      if (!selection || selection.get('length') === 0) {
        return this.get('prompt');
      } else {  // Array
        return selection.joinObj(",", "name");
      }
    } else {
      var name = this.get('selection.name');
      return name ?  name : this.get('prompt');
    }
  }.property('selection.id', 'selection.length'),

  isActiveChanged: function() {
    var isActive = this.get('isActive'), drop = this.$('div.select-picker-drop');
    if (!isActive) {
      drop.css({left: "-10000px"});
    } else {
      drop.css({left: "0px"});
    }
  }.observes('isActive'),

  keywordsChanged: function() {
    var coll = this.get('content'),
      keywords = this.get('keywords');

    if (keywords) {
      this.set('searchContent', coll.filter(function(item){
        if (item.get('name').indexOf(keywords) > -1) {
          return true;
        }
      }));
    } else {
      this.set('searchContent', coll);
    }
  }.observes('keywords'),

  init: function() {
    this._super();
    this.set('searchContent', this.get('content'));
  },

  didInsertElement: function() {
    var $elem = this.$(),
      __this = this;

    this.$("a.select-picker-single").click(function(){
      var isActive = __this.get("isActive");
      __this.set("isActive", !isActive);
    });
    this.$("ul").niceScroll({'cursorwidth': '6px', 'scrollspeed': 60, 'mousescrollstep': 60});

    // 点击其他地方，关闭picker
    var callback = function(evt) {
      var parent = $(evt.target).parents('div.select-picker');
      // 判断点击的是否为picker控件内部元素
      if (parent.attr('id') !== $elem.attr('id')) {
        // 隐藏picker
        if (__this.get('isActive')) {
          __this.set('isActive', false);
        }
      }
      return true;
    };

    $(document).bind({'click': callback}, {'touchstart': callback});
  }
});