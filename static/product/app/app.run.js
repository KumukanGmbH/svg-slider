'use strict';
//
// Run
//
angular.module('product_management_tool').run(function (formlyConfig, formlyValidationMessages) {
  //
  // Formly Config
  //
  // NOTE: This next line is highly recommended. Otherwise Chrome's autocomplete will appear over your options!
  formlyConfig.extras.removeChromeAutoComplete = true;
  formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
  formlyValidationMessages.addStringMessage('required', 'This field is required');
  formlyConfig.setType({
    name: 'async-ui-select',
    extends: 'select',
    templateUrl: 'async-ui-select-type.html'
  });

});
