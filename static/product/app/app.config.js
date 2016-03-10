'use strict';
//
// Config
//
angular.module('product_management_tool').config(function (formlyConfigProvider, $httpProvider) {

  formlyConfigProvider.setWrapper({
    name: 'validation',
    types: ['input'],
    templateUrl: 'error-messages.html'
  });
  // inject error handler
  $httpProvider.interceptors.push("ErrorsHTTPInterceptor");// end interceptor

});
