import Ember from 'ember';

export default Ember.Controller.extend({
  // Navigatable的总数
  pages: 0,
  // 页面滑动时间(秒)
  wait: 0.4,

  isMove: false,
  push: function(navigatableViewClass, callback) {
    if (this.get("isMove")) {
      return;
    }

    this.set("isMove", true);

    this.__previous(navigatableViewClass, callback);
  },

  pop: function(callback) {
    if (this.get("isMove")) {
      return;
    }

    this.set("isMove", true);

    this.__back(callback);
  },

  /*
   * Private method
   */
  __previous: function(navigatableViewClass, callback) {
    var user = this.get("currentUser"),
      store = this.get("store"),
      wait = this.get("wait"),
      $well = this.get("well"),
      $channel = this.get("channel"),
      $navigation = this.get('navigationView'),
      pages = this.get("pages"),
      width = $well.width();

    pages = pages + 1;

    $channel.css({"width": '%@px'.fmt(pages * width)});

    this.get("contentView").pushObject(navigatableViewClass.create({
      currentUser: user,
      store: store,
    }));

    $channel.animate(
      {"marginLeft": '%@px'.fmt(-width * (pages - 1))},
      {"speed": this.get("wait") * 1000}
    );

    var runLater = Ember.run.later(this, function(){
      this.set("isMove", false);
      this.set("pages", pages);
      Ember.run.cancel(runLater);

      $navigation.css({'height': '%@px'.fmt($well.height())});

      if (typeof(callback) === 'function') {
        callback();
      }
    }, wait * 1000);
  },

  __back: function(callback) {
    var $well = this.get("well"),
      $channel = this.get("channel"),
      $navigation = this.get('navigationView'),
      pages = this.get("pages"),
      width = $well.width(),
      wait = this.get("wait");

    $channel.animate(
      {"marginLeft": '%@px'.fmt(-width * (pages - 2))},
      {"speed": this.get("wait") * 1000}
    );

    var runLater = Ember.run.later(this, function(){
      this.get("contentView").popObject();
      this.set("isMove", false);
      this.set("pages", pages - 1);
      Ember.run.cancel(runLater);

      $navigation.css({'height': '%@px'.fmt($well.height())});

      if (typeof(callback) === 'function') {
        callback();
      }
    }, wait * 1000);
  }
});