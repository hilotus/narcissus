import Ember from 'ember';

export default Ember.View.extend({
  willInsertElement: function() {
    Pace.start({ ajax: false });

    Ember.run.scheduleOnce('actions', function(){
      window.duoshuoQuery = {short_name:"narcissus"};
      var ds = document.createElement('script');
      ds.type = 'text/javascript';ds.async = true;
      ds.src = (document.location.protocol === 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
      ds.charset = 'UTF-8';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
    });
  }
});
