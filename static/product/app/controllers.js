'use strict';
//
// Controllers
//
angular.module('product_management_tool')
  .controller('ProductManagementController',
    ['$scope', '$log', '$uibModal', 'ProductService',
    function ($scope, $log, $uibModal, ProductService) {
      /*
      Here you can handle controller for specific route as well.
      */
      $scope.products = {};
      $scope.autosuggest_item = {};
      $scope.autosuggest = [];

      $scope.AutosuggestProducts = function(q) {
        if (q && q.length > 0) {
          ProductService.suggest(q).then(function(response) {
            //console.log(response.results)
            $scope.autosuggest = response.results;
          });
        }
      };

      $scope.ProductSearch = function (item, model) {
        if (item && item.text.length > 0) {
          ProductService.search(item.text).then(function(response) {
            $scope.products = response;
          });
        }
      };

      $scope.Go = function (url) {
          ProductService.go(url).then(function(response) {
            $scope.products = response;
          });
      };

      $scope.ShowProductModal = function (product, size) {
        size = size || 'lg';

        //console.log('Modal Instance for Product:' + (product === undefined ? "New Product" : product.uuid))
        console.log(product)
        // setup the modal instance
        var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: window.STATIC_URL + 'product/app/product-form.html',
          controller: 'ModalInstanceController',
          size: size,
          resolve: {
            product: function () {
              return product;
            }
          }
        });
        // modify the results
        modalInstance.result.then(function (selectedItem) {

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      }
  }]);

angular.module('product_management_tool')
  .controller('ModalInstanceController',
    ["$scope", '$uibModalInstance', 'product', 'ProductService', 'md5',
    function ($scope, $uibModalInstance, product, ProductService, md5) {

      var constructForm = function (product, fake_brand, fake_group, fake_category, fake_sector) {
          //
          // Refresh Variables
          //
          var refreshBrands = function (q, field) {
            if (q) {
              ProductService.brand_suggest(q).then(function success(data) {
                field.templateOptions.options = data.results;
              });
            }
          };
          var refreshGroups = function (q, field) {
            if (q) {
              ProductService.group_suggest(q).then(function success(data) {
                field.templateOptions.options = data.results;
              });
            }
          };
          var refreshCategories = function (q, field) {
            if (q) {
              ProductService.category_suggest(q).then(function success(data) {
                field.templateOptions.options = data.results;
              });
            }
          };
          var refreshSectors = function (q, field) {
            if (q) {
              ProductService.sector_suggest($scope.product.fake_group.id, q).then(function success(data) {
                field.templateOptions.options = data.results;
              });
            }
          };
        //
        // end refresh variables
        //
        product.fake_brand = fake_brand;
        product.fake_group = fake_group;
        product.fake_category = fake_category;
        product.fake_sector = fake_sector;

        //
        // for segment exclusion in dropdowns
        //
        $scope.currentSegments = [];
        angular.forEach(product.segments, function (value, key) {
          $scope.currentSegments.push(value.name);
        });

        $scope.fields = [
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'fake_brand',
                type: 'async-ui-select',
                templateOptions: {
                  required: true,
                  label: 'Brand',
                  valueProp: 'id',
                  labelProp: 'text',
                  options: [],
                  refresh: refreshBrands,
                  refreshDelay: 0,
                },
                validators: {
                  fake_brand: function($viewValue, $modelValue, scope) {
                      alert($viewValue);
                      alert($modelValue);
                      return false;
                  }
                }
              },
              {
                className: 'col-xs-6',
                key: 'name',
                type: 'input',
                templateOptions: {
                  required: true,
                  label: 'Model Name',
                  placeholder: 'Product Model Name'
                }
              }
            ],
          },
          {
            model: product.detail,
            key: 'short_description',
            type: 'textarea',
            templateOptions: {
              required: true,
              label: 'Brief Description',
              placeholder: '',
              rows: 2,
              cols: 15
            }
          },
          {
            model: product.detail,
            key: 'long_description',
            type: 'textarea',
            templateOptions: {
              label: 'Full Description',
              placeholder: '',
              rows: 4,
              cols: 15
            }
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'fake_group',
                type: 'async-ui-select',
                templateOptions: {
                  required: true,
                  label: 'Group',
                  valueProp: 'id',
                  labelProp: 'text',
                  options: [],
                  refresh: refreshGroups,
                  refreshDelay: 0
                }
              },
            ],
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'fake_category',
                type: 'async-ui-select',
                templateOptions: {
                  required: true,
                  label: 'Category',
                  valueProp: 'id',
                  labelProp: 'text',
                  options: [],
                  refresh: refreshCategories,
                  refreshDelay: 0
                }
              },
              {
                className: 'col-xs-6',
                key: 'fake_sector',
                type: 'async-ui-select',
                templateOptions: {
                  required: true,
                  label: 'Sector',
                  valueProp: 'id',
                  labelProp: 'text',
                  options: [],
                  refresh: refreshSectors,
                  refreshDelay: 0
                }
              },
            ],
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'detail.ean',
                type: 'input',
                templateOptions: {
                  label: 'EAN',
                  placeholder: ''
                }
              },
              {
                className: 'col-xs-6',
                key: 'detail.asin',
                type: 'input',
                templateOptions: {
                  label: 'ASIN',
                  placeholder: ''
                }
              },
            ],
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'detail.gtin',
                type: 'input',
                templateOptions: {
                  label: 'GTIN',
                  placeholder: ''
                }
              },
              {
                className: 'col-xs-6',
                key: 'detail.product_code',
                type: 'input',
                templateOptions: {
                  label: 'Product Code',
                  placeholder: ''
                }
              },
            ],
          },
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'detail.variant_group_id',
                type: 'input',
                templateOptions: {
                  label: 'Variant GroupId',
                  placeholder: ''
                }
              },
              {
                className: 'col-xs-6',
                key: 'detail.variant_count',
                type: 'input',
                templateOptions: {
                  label: 'Variant Count',
                  placeholder: ''
                }
              },
            ],
          },
        ]; // End $scope.fields

        //
        // Form for the manual upload
        //
        $scope.manual_form_fields = [
          {
            className: 'row',
            fieldGroup: [
              {
                className: 'col-xs-6',
                key: 'website_url',
                type: 'input',
                templateOptions: {
                  label: 'URL the manual was found',
                  placeholder: '',
                  required: true
                }
              }
            ],
          },
        ]; // End $scope.fields
      } // end construct form

      $scope.title = (product === undefined ? "Create a New Product" : "Edit " + product.name);

      $scope.product = product || {};

      $scope.product = angular.extend({}, {
        segments: [],
        detail: {},
      }, $scope.product);

      $scope.fake_brand = {"text": null, "id":null};
      $scope.fake_group = {"text": null, "id":null};
      $scope.fake_category = {"text": null, "id":null};
      $scope.fake_sector = {"text": null, "id":null};

      // dropdowns for segments and features
      $scope.available_segments = {};
      $scope.available_segment_features = {};

      $scope.upload_manual = {};
      $scope.upload_image = {};

      // Setup Watches
      $scope.$watch('product.fake_group', function(newValue, oldValue) {
        // When the group changes then update the AVAILABLE segments and features
        newValue = (newValue) ? newValue : {} ;
        newValue.id = newValue.id || $scope.product.group.id || undefined;

        if (newValue.id) {
          if (oldValue !== undefined) {
            //
            // Reset the current segments
            // this clears the products segments
            //
            $scope.currentSegments = $scope.product.segments = [];
            // reset the available segments
            $scope.available_segments = {};
          }

          ProductService.group_segments_and_features(newValue.id).then(function success(data) {
            angular.forEach(data, function (segment) {
              segment = segment.toJSON();
              var key = segment.name;
              $scope.available_segments[key] = segment;
              $scope.available_segment_features[key] = segment.features;
            });
          }); // end ProductService.group_segments_and_features

        }

      });

      // Form config
      $scope.options = {
        formState: {}
      };

      if (product == undefined) {
        //
        // Create a new product
        //
        constructForm($scope.product, $scope.fake_brand, $scope.fake_group, $scope.fake_category, $scope.fake_sector);

      } else {
        //
        // Edit product
        //

        //
        // Get the full product detail
        //
        ProductService.detail(product.uuid).then(function (response) {
          // set teh scope product
          $scope.product = response;

          // Setup Fakes
          // emulate an options opbect so that select dosent lose its mind
          $scope.fake_brand       = {"text": $scope.product.brand.name || null, "id": $scope.product.brand.id};
          $scope.fake_group       = {"text": $scope.product.group.name || null, "id": $scope.product.group.id};
          $scope.fake_category    = {"text": $scope.product.category.name || null, "id": $scope.product.category.id};
          $scope.fake_sector      = {"text": $scope.product.sector.name || null, "id": $scope.product.sector.id};

          constructForm($scope.product, $scope.fake_brand, $scope.fake_group, $scope.fake_category, $scope.fake_sector);
        }); // End ProductService.detail

      };


      /**
      * SUBMIT FORM
      **/
      $scope.ok = $scope.Submit = function () {
        if ($scope.upload_manual !== null && Object.keys($scope.upload_manual).length > 0) {
          $scope.manual_form.$setSubmitted();
          if ($scope.manual_form.$valid == false) {
            return;
          }
        }
        // Validate
        $scope.form.$setSubmitted();
        if ($scope.form.$valid) {

          // Massage the data into something the conporter expects
          var request_data = MassageDataIntoConPorterFormat($scope.product);

          // Send it
          ProductService.save(request_data, $scope.product.uuid || undefined)
            .then(function success(data) {
                     // THEN HAVE TO SUBMIT THE MANUALS TO THE MANUAL ENDPOINT: https://github.com/KumukanGmbH/product_service/blob/jsonify-product-features/doc/http/create_document.md
                     if ($scope.upload_manual !== null && Object.keys($scope.upload_manual).length > 0) {
                        $scope.manual_form.$setSubmitted()
                        if ($scope.manual_form.$valid === true) {
                          //
                          // Append the md5 value to the sent data
                          //
                          $scope.upload_manual.md5 = md5.createHash($scope.upload_manual.base64);
                          ProductService.save_document($scope.product.uuid,
                                                       $scope.upload_manual,
                                                       data.brand.id)
                          .then(function success (response) {
                            $uibModalInstance.close();
                            $scope.options.updateInitialValue();
                          });
                        } // end if ($scope.manual_form.$valid)
                     } else {
                        $uibModalInstance.close();
                        //$scope.options.updateInitialValue();
                     }
                }
            );
        } // end valid check
      };

      var MassageDataIntoConPorterFormat = function (product_data) {
          // format like: https://github.com/KumukanGmbH/product_service/blob/jsonify-product-features/doc/http/create_product.md
          var images = ($scope.upload_image === null || $scope.upload_image.uri === undefined ? undefined : [{"Image1URL": $scope.upload_image.uri}]);

          var data = {
            "product": {
              "uuid": product_data.uuid,
              "name": product_data.name,
              "brand_attributes": {
                "id": product_data.fake_brand.id,
                "name": product_data.fake_brand.text
              },
              "group_attributes": {
                "id": product_data.fake_group.id,
                "name": product_data.fake_group.text
              },
              "category_attributes": {
                "id": product_data.fake_category.id,
                "name": product_data.fake_category.text
              },
              "sector_attributes": {
                "id": product_data.fake_sector.id,
                "name": product_data.fake_sector.text
              },
              "detail_attributes": {
                "ean": product_data.detail.ean,
                "asin": product_data.detail.asin,
                "product_code": product_data.detail.product_code,
                "variant_count": product_data.detail.variant_count,
                "long_description": product_data.detail.long_description,
                "variant_group_id": product_data.detail.variant_group_id,
                "short_description": product_data.detail.short_description
              },
              "segments": (product_data.segments ? JSON.stringify(product_data.segments) : null),
              "images": (images ? JSON.stringify(images) : null),
            }
          }

          return data;
      };

      //
      // Uploaders
      //
      $scope.FileLoadedHandler = function (event, reader, fileList, fileObjs, file) {
        // console.log('FileLoadedHandler')
        // console.log(file)
        ProductService.upload_tmp_file(file).then(function success(response) {
            angular.forEach(response, function (value, key) {
              if (value.upload_type.indexOf('image') !==  -1) {

                // add the url to the object
                $scope.upload_image.uri = value.url;

              }else if (value.upload_type.indexOf('pdf') !==  -1) {
                // add the url to the object
                // we only have 1 manual
                $scope.upload_manual.uri = value.url;
              }
            });
        });
      };

      $scope.FileProgressHandler = function (event, reader, fileList, fileObjs, file) {
        // console.log('FileProgressHandler')
        // console.log(file)
        // console.log(fileList)
      };

      $scope.FileErrorHandler = function (event, reader, fileList, fileObjs, file) {
        // console.log('FileErrorHandler')
        // console.log(file)
        // console.log(fileList)
      };


      //
      // Feature and Segments
      //
      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.AddSegment = function () {
        //
        // Add a blank placeholder until the user selects an available segment from the select menu
        //
        $scope.product.segments.unshift({});
      };

      $scope.UpdateSegment = function (segment, index) {
        //
        // Add the segment once selected from the manual dropdown list
        //
        $scope.product.segments[index] = segment;
      };

      $scope.RemoveSegment = function (segment_index) {
        $scope.product.segments.splice(segment_index, 1);
      };

      $scope.AddSegmentFeature = function (segment, feature_index) {
        segment.features.push({"id": null, "name": "", "value": ""});
      };

      $scope.RemoveSegmentFeature = function (segment, feature_index) {
        segment.features.splice(feature_index, 1);
      };
      //
      // End Feature and Segments
      //
  }]);