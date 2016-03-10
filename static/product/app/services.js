'use strict';
//
// Services
//
var ErrorsHTTPInterceptor = function ($injector) {
  return {
    // response: function(config) {
    //   console.log("Success - BudsHTTPInterceptor" + status);
    //   return config;
    // },
    responseError: function(response) {
      //var toastr = $injector.get("toastr");
      console.log("Error - BudsHTTPInterceptor" + status + JSON.stringify(response));
      //toastr.error(response, 'Error')
    }
  };
};
angular.module('product_management_tool').service("ErrorsHTTPInterceptor", ['$injector', ErrorsHTTPInterceptor]);

angular.module('product_management_tool').service('ProductService', [
    '$q',
    '$log',
    '$resource',
    '$http',
    'toastr',
    function($q, $log, $resource, $http, toastr) {

      var ManualOneConf = {
        "API_ENDPOINTS": {
          "default": window.ManualOneConf.API_ENDPOINTS.default || "https://staging-api.manualone.com",
        },
      };

      function ProductAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default, {}, {
          'detail': { 'url': ManualOneConf.API_ENDPOINTS.default + '/v1/products/:uuid/full.json', 'method': 'GET', 'headers': { 'Content-Type': 'application/json' }},
          'save': { 'url': ManualOneConf.API_ENDPOINTS.default + '/v1/products/ ', 'method': 'POST', 'headers': { 'Content-Type': 'application/json' }},
        });
      }

      function ProductSearchAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/products/search');
      }

      function ProductAutoSuggestAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/products/suggest');
      }

      function BrandAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/brands/suggest');
      }

      function GroupAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/groups/suggest');
      }

      function CategoryAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/categories/suggest');
      }

      function SectorAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/sectors/suggest');
      }

      function GroupSegmentAPI() {
        return $resource(ManualOneConf.API_ENDPOINTS.default + '/v1/groups/:group_id/segments_and_features', {}, {
          'query': { 'url': ManualOneConf.API_ENDPOINTS.default + '/v1/groups/:group_id/segments_and_features', 'method': 'GET', 'isArray': true, 'headers': { 'Content-Type': 'application/json' }},
        });
      }

      // main query object that performs the primary events
      var query = function(api, event_name, query_data, data) {
        data = data || {};
        var deferred = $q.defer();

        api[event_name](query_data, data,
          function success(response) {
            try {
              var resp = response.toJSON();
            } catch(err) {
              var resp = response;
            }
            deferred.resolve(resp);
          },
          function error(err) {
            toastr.error(err, 'Error');
            deferred.reject(err);
          }
        );

        return deferred.promise;
      };

      // Return Factory of methods
      return {
        suggest: function (q) {
          return query(ProductAutoSuggestAPI(), 'get', {q: q});
        },
        search: function (q) {
          return query(ProductSearchAPI(), 'get', {q: q});
        },
        go: function (url, method) {
          var deferred = $q.defer();
          method = method || 'GET';
          $http({
            method: method,
            url: url
            }).then(function success(response) {
              deferred.resolve(response.data);
            }, function error(err) {
              toastr.error(err, 'Error');
              deferred.reject(err);
          });
          return deferred.promise;
        },
        detail: function (uuid) {
          return query(ProductAPI(), 'detail', {uuid: uuid});
        },
        save: function (data, uuid) {
          var query_data = {};
          return query(ProductAPI(), 'save', query_data, data);
        },
        brand_suggest: function (q) {
          return query(BrandAPI(), 'get', {q: q});
        },
        group_suggest: function (q) {
          return query(GroupAPI(), 'get', {q: q});
        },
        category_suggest: function (q) {
          return query(CategoryAPI(), 'get', {q: q});
        },
        sector_suggest: function (group_id, q) {
          return query(SectorAPI(group_id), 'get', {q: q});
        },
        group_segments_and_features: function (group_id) {
          return query(GroupSegmentAPI(group_id), 'query', {'group_id': group_id});
        },
        upload_tmp_file: function (file) {
          var deferred = $q.defer();
          var data = file;
          $http({
                  method: 'POST',
                  url: window.FILE_UPLOAD_ENDPOINT,
                  data: data,
                  headers: {
                    'X-CSRFToken': window.HTTP_X_CSRFTOKEN
                  },
            }).then(function success(response) {
              deferred.resolve(response.data);
            }, function error(err) {
              toastr.error(err, 'Error');
              deferred.reject(err);
            });
          return deferred.promise;
        },
        save_document: function (product_uuid, manual, brand_id) {
          var deferred = $q.defer();
          var data = {
            "document": {
              "product_uuid": product_uuid,
              "url": manual.uri,
              "filename": manual.filename,
              "filesize": manual.filesize,
              "website_url": manual.website_url,
              "md5": manual.md5,
              "brand_id": brand_id
            }
          };

          $http({
                  method: 'POST',
                  url: ManualOneConf.API_ENDPOINTS.default + '/v1/documents',
                  data: data,
                  headers: {
                    'X-CSRFToken': window.HTTP_X_CSRFTOKEN
                  },
            }).then(function success(response) {
              deferred.resolve({});
            }, function error(err) {
              toastr.error(err, 'Error');
              deferred.reject(err);
            });
          return deferred.promise;
        }
      };

    }
  ]);

