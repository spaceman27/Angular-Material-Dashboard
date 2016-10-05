(function() {
  'use strict';
  app.filter("exactName", [
    "$filter",
    function($filter) {
      return function(arr, selectedValue) {
        if ( arr) {
          var displayName = selectedValue ? selectedValue.display : "";
          if ( arr.hasOwnProperty(displayName)) {
            var hash = {};
            hash[displayName] =  arr[displayName];
            return hash;
          } else {
            return arr;
          }
        }
      };
    }
  ]);
})();