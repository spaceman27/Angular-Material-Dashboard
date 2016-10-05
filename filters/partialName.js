    (function() {
      'use strict';
      app.filter("partialName", [
        "$filter",
        function($filter) {
          return function(arr, selectedValue) {
            if (arr && selectedValue) {
              var displayName = angular.lowercase(selectedValue);
              var hash = {};
              var filterItems = Object.keys(arr).filter(function(val) {
                return angular.lowercase(val).indexOf(displayName) >= 0;
              });
              for (var i in filterItems) {
                hash[filterItems[i]] = arr[filterItems[i]];
              }
              return hash;
            }
            return arr;
          };
        }
      ]);
    })();