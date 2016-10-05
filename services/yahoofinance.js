(function() {
  'use strict';

  function yahooService($http, $q) {
    function getPrice(symbol) {
      var deferred = $q.defer();
      //  generate from https://developer.yahoo.com/yql/console
     $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%3D'"+symbol+"'&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
        .success(function (item) {
          deferred.resolve(item);
        }).error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
    }
    function getChart(symbol){
      var deferred = $q.defer();
      //  generated from https://developer.yahoo.com/yql/console
     $http.get("http://ichart.finance.yahoo.com/w?s=ffiv"+symbol)
        .success(function (item) {
          deferred.resolve(item);
        }).error(function (error) {
          deferred.reject(error);
        });
      return deferred.promise;
      
    }
    return {
      getPrice: getPrice,
      //getChart: getChart,
    };
  }
  app.factory("financeService", ["$http", "$q", yahooService]);
})();