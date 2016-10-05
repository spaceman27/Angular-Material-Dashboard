(function() {
  'use strict';
  app.controller("analyticController", ['$scope', 'financeService', function($scope, financeService) {
    $scope.stockSymbols = ["EDJI","GOOG"];
  }]);
})();