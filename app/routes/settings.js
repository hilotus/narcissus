import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this._super();

    if (this.get("currentUser")) {
      // 添加 Settings Navigation
      this.render("settings/navigation", { into: 'settings', outlet: 'navigation'});
    }
  },

  actions: {
    willTransition: function(/*transition*/) {
      this.controllerFor('settings/navigation').set('pages', 0);
      this.disconnectOutlet({ outlet: 'navigation', parentView: 'settings' });
    }
  }
});
