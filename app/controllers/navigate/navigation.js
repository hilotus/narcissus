import Ember from 'ember';

export default Ember.Controller.extend({
  // Navigatable的总数
  pages: 0,
  // 页面滑动时间(秒)
  wait: 0.4,

  isMove: false,
  push: function(navigatableViewClass) {
    if (this.get("isMove")) {
      return;
    }

    this.set("isMove", true);

    this.__previous(navigatableViewClass);
  },

  pop: function() {
    if (this.get("isMove")) {
      return;
    }

    this.set("isMove", true);

    this.__back();
  },

  /*
   * Private method
   */
  __previous: function(navigatableViewClass) {
    var user = this.get("currentUser"),
      store = this.get("store"),
      wait = this.get("wait"),
      $well = this.get("well"),
      $channel = this.get("channel"),
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
    }, wait * 1000);
  },

  __back: function() {
    var $well = this.get("well"),
      $channel = this.get("channel"),
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
    }, wait * 1000);
  }
});