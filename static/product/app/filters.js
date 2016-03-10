'use strict';
//
// Filters
//
function SegmentFilter () {

 //Inner function which is our filter
  return function(items, ignoredItem, scope){
     var filteredItems = [];

     angular.forEach(items, function(segment){
        if(scope.currentSegments.indexOf(segment.name) === -1 || segment.name == ignoredItem){
           filteredItems.push(segment);
        }
     });

     return filteredItems;
  }
}
angular.module('product_management_tool').filter('SegmentFilter', SegmentFilter);
