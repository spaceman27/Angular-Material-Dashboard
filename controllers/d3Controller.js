(function() {
  'use strict';
app.controller("d3Controller", ['$scope','financeService', function ($scope, financeService){

  // LOAD D3 CHART
  $scope.padding = {top: 50, bottom: 20, left: 40, right: 20};
    $scope.barcolors = ["#006600", "#CC0000", "#FF9900"];
    $scope.data = {
      data: [{
        key: "Complicant",
        values: [{
          x: "OS",
          y: 4080
        }, {
          x: "SQL",
          y: 311
        }, {
          x: "OSIPAK",
          y: 3246
        }, {
          x: "SQLIPAK",
          y: 206
        }]
      }, {
        key: "NonCompliant",
        values: [{
          x: "OS",
          y: 9
        }, {
          x: "SQL",
          y: 104
        }, {
          x: "OSIPAK",
          y: 825
        }, {
          x: "SQLIPAK",
          y: 209
        }]
      }, {
        key: "DataGap",
        values: [{
          x: "OS",
          y: 28
        }, {
          x: "SQL",
          y: 2
        }, {
          x: "OSIPAK",
          y: 44
        }, {
          x: "SQLIPAK",
          y: 2
        }]
      }]
    };
}]);

  

})();