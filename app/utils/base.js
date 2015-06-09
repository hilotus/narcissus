import Ember from 'ember';

export default Ember.Object.create({
  colors: '#AB9364 #283890 #25AAE2 #92278F #990000 #05f #3AB54A #aaa #F7941D #5aba59 #4d85d1 #8156a7 #df2d4f'.w(),
  color: function() {
    var array = this.get('colors');
    var n = Math.floor(Math.random() * array.length + 1) - 1;
    return array[n];
  }
});
