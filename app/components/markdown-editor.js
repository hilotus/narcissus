import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'markdown-editor',
  classNameBindings: [':markdown-editor'],
  isEditting: true,
  height: 420,
  body: '',

  actions: {
    toggle: function() {
      var isEditting = this.get('isEditting');
      this.$('.CodeMirror').css({'display': (isEditting ? 'none' : 'block')});
      this.set('isEditting', !isEditting);
    }
  },

  didInsertElement: function() {
    var width = this.$().parent().width();

    Ember.run.schedule('afterRender', this, function(){
      // init codemirror
      this.$("textarea").text(this.get('body'));

      var textareaEl = this.$("textarea")[0],
        that = this;

      if (!!textareaEl) {
        var editor = CodeMirror.fromTextArea(textareaEl, {
          maxHighlightLength: 50000,
          lineNumbers: true,
          lineWrapping: true,
          matchBrackets: true,
          foldGutter: true,
          tabSize: 2,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          mode: "markdown"
        });
        editor.setSize(width, this.get('height'));

        editor.on('change', function(instance){
          that.set('body', instance.getValue());
        });
      }
    });
  }
});
