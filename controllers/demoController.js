(function() {
  'use strict';
  app.controller("demoController", ['$scope', '$filter', 'financeService', function($scope, $filter, financeService) {
    
    $scope.searchText = null;
    $scope.selectedItem = null;
    $scope.inputText = null;
    $scope.isBusy = true;
    financeService.getPrice("FFIV").then(function(item) {
      $scope.stock = item.query.results.quote;
      self.allName = loadAll();
      $scope.isBusy = false;
    });
    
    /**
     * Build `stock attribute` list of key/value pairs
     */
    function loadAll() {
      return Object.keys($scope.stock).map(function (val) {
        return {
          value: val.toLowerCase(),
          display: val
        };
      });
    }
    /**
     * Search for stock... use $timeout to simulate
     * remote dataservice call.
     */
    $scope.querySearch = function (query) {
      
      var results = query ? self.allName.filter( createFilterFor(query) ) : [];
      return results;
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
       return function filterFn(attrName) {
        return attrName.value.indexOf(lowercaseQuery)=== 0;
      };
    }
  }]);
})();