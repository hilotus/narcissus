import NavigatableView from 'narcissus/views/navigate/navigatable';
import SingleCheckSection from 'narcissus/supports/navigate/single-check-section';

export default NavigatableView.extend({
  title: function() {
    var t = this.container.lookup('utils:t');
    return t('settings.language.title');
  }.property(),

  hasLeftButton: true,
  leftButtonTitle: function() {
    var t = this.container.lookup('utils:t');
    return t('settings.title');
  }.property(),
  leftButtonAction: function() {
    this.container.lookup('user:current').discardChanges();
    this.container.lookup('controller:settings/navigation').pop();
  },

  hasRightButton: true,
  rightButtonTitle: function() {
    var t = this.container.lookup('utils:t');
    return t('button.save');
  }.property(),
  rightButtonAction: function() {
    var user = this.container.lookup('user:current'),
      t = this.container.lookup('utils:t'),
      _alert = this.container.lookup('modal:alert'),
      spin = this.container.lookup('modal:spin'),
      closeSpinner = this.container.lookup('modal:closespinner');

    if (!$.isEmptyObject(user.getChanges())) {
      spin(t("button.saving"));
      user.commitChanges().then(function() {
        window.location.reload();
      }).catch(function(reason) {
        _alert(t('ajax.error.operate'), reason.error, 'error');
      }).finally(function() {
        closeSpinner();
      });
    }
  },

  sections: ["optionsSection"],
  optionsSection: SingleCheckSection.extend({
    title: function() {
      var t = this.get('owner.container').lookup('utils:t');
      return t('settings.section.header.language');
    }.property(),

    init: function() {
      this._super();
      var currentUser = this.get('owner.container').lookup('user:current');
      this.set('selected', currentUser.locale);
    },

    onSelect: function(rowValue) {
      this._super(rowValue);
      var user = this.get('owner.controller.currentUser');
      user.set('locale', rowValue);
    },

    rows: function() {
      var t = this.get('owner.container').lookup('utils:t');
      var enUS = t('settings.language.enUS'),
        zhCN = t('settings.language.zhCN');

      return [
        {label: enUS, value: 'en-us'},
        {label: zhCN, value: 'zh-cn'}
      ];
    }.property()
  })
});
