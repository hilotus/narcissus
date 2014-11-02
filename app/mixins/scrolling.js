import Ember from 'ember';
import RunUtil from '../utils/run';

export default Ember.Mixin.create({
  bindScrolling: function() {
    var onScroll, _this = this, opts = {debounce: 100};

    if (opts.debounce) {
      onScroll = RunUtil.debounce(function(evt) { return _this.scrolled(evt); }, 100);
    } else {
      onScroll = function(){
        return _this.scrolled();
      };
    }
    $(document).bind('touchmove', onScroll);
    $(window).bind('scroll', onScroll);
  },

  unbindScrolling: function() {
    $(document).unbind('touchmove');
    $(window).unbind('scroll');
  }
});
