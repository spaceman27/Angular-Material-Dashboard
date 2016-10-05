(function() {
  'use strict';
  // DEPENDENCY INJECTION GLOBAL SERVICE
  // ALERT, BUSY, INDICATOR, AUTHENTICATION...
  app.controller("appCtrl", ['$scope', function($scope) {
    $scope.isOpen = false;
    $scope.demo = {
      isOpen: false,
      count: 0,
      selectedAlignment: 'md-left'
    };
  }]);
})();