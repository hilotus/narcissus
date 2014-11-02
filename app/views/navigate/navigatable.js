import Ember from 'ember';

export default Ember.View.extend({
  classNames: ['navigatable'],
  title: "",

  hasLeftButton: false,
  leftButtonTitle: "",

  hasRightButton: false,
  rightButtonTitle: "",

  actions: {
    leftButtonAction: function(){},
    rightButtonAction: function(){},
  },

  sections: [],
  content: [],
  templateName: 'navigate/navigatable',

  generate: function(){
    var _this = this,
      user = this.get("currentUser"),
      store = this.get("store");

    _this.set("sectionsView", []);
    this.get("sections").forEach(function(section){
      section = _this.get(section).create({owner: _this});
      section.set("rowsView", []);

      // 一般的row
      section.get("rows").forEach(function(row) {
        row = section.get(row).create({owner: _this, section: section, currentUser: user, store: store});
        section.get("rowsView").pushObject(row);
      });

      // row的集合
      if (section.get("rowCollection")) {
        section.get("rowCollection").forEach(function(row) {
          row = row.create({owner: _this, section: section, currentUser: user, store: store});
          section.get("rowsView").pushObject(row);
        });
      }

      _this.get("sectionsView").pushObject(section);
    });
  }.on("willInsertElement")
});
