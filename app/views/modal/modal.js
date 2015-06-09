import Ember from 'ember';

export default Ember.View.extend({
  elementId: "blog-modal",
  classNames: ["modal", "modal-active"],
  templateName: "modal/modal"
});
