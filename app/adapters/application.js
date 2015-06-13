import ParseAjax from 'ember-cli-coreweb/mixins/parse-ajax';
import ENV from 'narcissus/config/environment';

export default CW.AdapterParse.extend(ParseAjax, {
  applicationId: ENV.APP.parseApplicationId,
  restApiKey: ENV.APP.parseRestApiKey
});
