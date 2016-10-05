(function() {
  'use strict';
  app.directive('selfismMultibar', function() {

    return {
      restrict: 'EA',
      scope: {id: '=',
        data: '=',
        width: '@',
        height: '@',
        padding: '@',
        transitionduration: '@',
        barcolors: '&'
      },
      controller: [ 
        '$scope',
        '$element',
        '$attrs', 
        function($scope, $element, $attrs) {
          $scope.d3Call = function(data, chart) {
            checkElementID($scope, $attrs, $element, chart, data);
          };
        }
      ],
      link: function(scope, element, attrs) {
        // scope.$watch( 'width + height', function () {
        //   updateDimensions( scope, attrs, element, scope.chart );
        // } ); 

        scope.$watch('data', function(data) {
          
          if (data) {
            //if the chart exists on the scope, do not call addGraph again, update data and call the chart.
            if (scope.chart) {
              // update chart
              return scope.d3Call(data, scope.chart);
            }
            // init new graph
            sic.addGraph({
              generate: function() {
                //initializeMargin( scope, attrs );
                var chart = sic.models.multiBar().width(scope.width).height(scope.height).padding(scope.padding);
                scope.d3Call(data, chart);
                //sic.utils.windowResize( chart.update );
                scope.chart = chart;
                return chart;
              },
              callback: attrs.callback === undefined ? null : scope.callback()
            });
          }
        }, attrs.objectequality === undefined ? false : attrs.objectequality === 'true');
      }
    };
  })
 function getD3Selector( attrs, element ) {
    if ( !attrs.id ) {
      //if an id is not supplied, create a random id.
      if ( !attrs[ 'data-chartid' ] ) {
        angular.element( element ).attr( 'data-chartid', 'chartid' + Math.floor( Math.random() * 1000000001 ) );
      }
      return '[data-chartid=' + angular.element( element ).attr( 'data-chartid') + ']';
    } else { 
      return '#' + attrs.id;
    }
  } 
  function checkElementID(scope, attrs, element, chart, data) {
  
    // do passing parameters to chart lib here
    
    // processEvents( chart, scope );
    var d3Select = getD3Selector(attrs, element);
    if (angular.isArray(data) && data.length === 0) {
      d3.select(d3Select + ' svg').remove();
    }
    // draw chart base on input data
    chart(data, element);
  }
})();