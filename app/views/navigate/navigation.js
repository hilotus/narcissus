import Ember from 'ember';

export default Ember.View.extend({
  classNames: ["navigation"],
  templateName: "navigate/navigation",

  init: function() {
    this._super();
    this.set("contentView", Ember.ContainerView.create());
  },

  didInsertElement: function() {
    this.set("controller.contentView", this.get("contentView"));

    var $elem = this.$(),
      $well = $elem.find(".navigation-well"),
      $channel = $well.find(".navigatable-channel");

    $channel.css({"width": '%@px'.fmt($well.width())});

    this.set("controller.well", $well);
    this.set("controller.channel", $channel);
    this.set("controller.navigationView", $elem);

    // TODO: 当 Navigation 在大于第一页处(如: 第二页)时，窗口大小变化，正确计算magin-left的值
  }
});