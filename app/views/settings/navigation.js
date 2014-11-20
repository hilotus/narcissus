import NavigationView from 'ember-cli-coreweb/views/navigate/navigation';
import SettingsNavigatable from './navigatable';

export default NavigationView.extend({
  classNames: ["settings"],

  didInsertElement: function() {
    this._super();

    // add first navigatable view to navigation view
    this.get("controller").push(SettingsNavigatable);
  }
});
