import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'epic-editor',

  body: '',
  // localStorage keyName
  localStorageName: Ember.computed(function(key, value){
    return Ember.isNone(value) ? 'epiceditor' : 'epiceditor-%@'.fmt(value);
  }),

  didInsertElement: function() {
    var $textarea = this.$('textarea');

    if (!Ember.isBlank(this.get('body'))) {
      $textarea.val(this.get('body'));
    }

    var opts = {
      textarea: $textarea[0],
      localStorageName: this.get('localStorageName'),
      theme: {
        base: 'http://epiceditor.com/epiceditor/themes/base/epiceditor.css',
        preview: 'http://epiceditor.com/epiceditor/themes/preview/github.css',
        editor: 'http://epiceditor.com/epiceditor/themes/editor/epic-light.css'
      },
      autogrow: {
        minHeight: this.get('minHeight') || 350,
        maxHeight: this.get('maxHeight') || 450,
        scroll: true
      }
    };
    var editor = new EpicEditor(opts);
    editor.load();
  },

  willDestroyElement: function() {
    delete localStorage[this.get('localStorageName')];
    delete localStorage["__draft-%@".fmt(this.get('localStorageName'))];
  }
});