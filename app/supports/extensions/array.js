export default function(/* container, app */) {
  // obj -> DS.Model
  Array.prototype.has = function(obj) {
    var isExists = false;
    this.forEach(function(item){
      if (item.get('id') === obj.get('id')) {
        isExists = true;
        return;
      }
    });
    return isExists;
  };

  Array.prototype.joinObj = function(sep, key) {
    var result = [];
    this.forEach(function(item){
      result.push(item.get(key));
    });
    return result.join(sep);
  };

  Array.prototype.getIds = function() {
    var result = [];
    this.forEach(function(record){
      result.push(record.get("id"));
    });
    return result;
  };
}