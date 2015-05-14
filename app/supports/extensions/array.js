import Ember from 'ember';

export default function(/* container, app */) {
  // obj -> DS.Model
  Array.prototype.has = function(obj) {
    var isExists = false;
    this.forEach(function(item){
      if ((item.get('id') || item.get('modelData.id')) === obj.get('id')) {
        isExists = true;
        return;
      }
    });
    return isExists;
  };

  Array.prototype.joinObj = function(sep, key) {
    return this.map(function(item){
      return item.get(key);
    }).join(sep);
  };

  /*
  * array element type
  * first: ["1", "2", "3"]
  * second: [modelInstance, modelInstance, modelInstance]
  */
  Array.prototype.getIds = function() {
    return this.map(function(record){
      return (record instanceof Ember.Object ? (record.get('id') || record.get('modelData')) : record);
    });
  };
}
