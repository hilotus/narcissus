import Ember from 'ember';

export default Ember.Component.extend({
  layoutName: 'check-box',

  classNameBindings: [":checkbox", 'isEnabled:enabled:disabled', 'isActive:active', 'value:selected', 'isFocus:focus'],
  isEnabled: true,
  isActive: false,
  isFocus: false,
  value: false,
  text: "",

  toggleOnValue: true,
  toggleOffValue: false,
  _toggleValue: function(){
    var isOn = this.get('value') === this.get('toggleOnValue');
    this.set('value', isOn ? this.get('toggleOffValue') : this.get('toggleOnValue'));
  },

  // 是否在控件内部摁下鼠标
  _isMouseDown: false,
  mouseDown: function(/*evt*/) {
    if(!this.get('isEnabled')) {
      return false;
    }
    this.set('isActive', true);
    this._isMouseDown = true;
    return true;
  },

  mouseUp: function(/*evt*/) {
    if (!this.get('isEnabled')) {
      return false;
    }
    this.set('isActive', false);
    this._isMouseDown = false;
    // this._toggleValue();
    // fire action
    // this._action(evt);
    return true;
  },

  click: function(/*evt*/) {
    if (!this.get('isEnabled')) {
      return false;
    }
    this._toggleValue();
    return true;
  },

  focusIn: function(/*evt*/) {
    if (!this._isMouseDown) {
      this.set('isFocus', true);
    }
  },

  focusOut: function(/*evt*/) {
    this.set('isFocus', false);
  },

  keyDown: function(evt) {
    if(!this.get('isEnabled')) {
      return true;
    }

    if (evt.which === 13 || evt.which === 32) {
      this._toggleValue();
      // fire action
      // this._action(evt);
      return true; // handled
    }
    return false;
  },

  didInsertElement: function() {
    var that = this, $elem = this.$();
    // 加上这个的原因是，点击鼠标，不释放，当拖到该元素范围外面在释放不会触发该元素的mouseup事件，但会触发document的mouseup事件。
    $(document).bind('mouseup', function(evt){
      var parent = $(evt.target).parents('div.checkbox');
      // 判断点击的是否为picker控件内部元素
      if (parent.attr('id') !== $elem.attr('id')) {
        if (!that._isMouseDown) {
          return true;
        }
        if (!that.get('isEnabled')) {
          return true;
        }
        that.set('isActive', false);
        that._isMouseDown = false;
      }
      return true;
    });
  }
});