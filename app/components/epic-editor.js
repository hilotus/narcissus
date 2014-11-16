import Ember from 'ember';

// TODO: How to reset epiceditor after record.save
export default Ember.Component.extend({
  layoutName: 'epic-editor',

  body: '',
  // localStorage keyName
  localStorageName: Ember.computed(function(key, value){
    return Ember.isNone(value) ? 'epiceditor' : 'epiceditor-%@'.fmt(value);
  }),
  textareaId: function(){
    return 'epiceditorTextarea' + this.get('localStorageName');
  }.property('localStorageName'),

  didInsertElement: function() {
    var $textarea = this.$('textarea'), __this = this;

    // initialize editor content
    $textarea.val(this.get('body'));

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

    // localStorageName is epiceditor, delete previous content, when record is new(record id is null).
    if (this.get('localStorageName') === 'epiceditor') {
      delete localStorage.epiceditor;
      delete localStorage['__draft-epiceditor'];
    }

    var editor = new EpicEditor(opts);
    editor.on('update', function(){
      try{
        var body = JSON.parse(localStorage[__this.get('localStorageName')]).epiceditor.content;
        __this.set('body', body);
      }catch(ex){}
    });
    var previewer;
    editor.on('preview', function () {
      $(previewer.head).append('<link rel="stylesheet" href="https://github.com/components/highlightjs/raw/master/styles/github.css" type="text/css"/>');
    });
    editor.load(function(){
      previewer = this.getElement('previewer');
    });
  },

  willDestroyElement: function() {
    delete localStorage[this.get('localStorageName')];
    delete localStorage["__draft-%@".fmt(this.get('localStorageName'))];
  }
});