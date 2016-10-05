(function() {
  'use strict';

  var sic = window.sic || {};
  window.sic = sic;

  sic.utils = sic.utils || {}; // Utility subsystem
  sic.models = sic.models || {}; //stores all the possible models/components
  sic.charts = {}; //stores all the ready to use charts
  sic.graphs = []; //stores all the graphs currently on the page

  // Core Function  
  sic.render = function render(step) {
    step = step || 1; // number of graphs to generate in each timeout loop
    var chart, graph;
    for (var i = 0; i < step && (graph = sic.render.queue[i]); i++) {
      chart = graph.generate();
      if (typeof graph.callback == typeof(Function)) graph.callback(chart);
      sic.graphs.push(chart);
    }
    sic.render.active = true;
  };
  sic.render.active = false;
  sic.render.queue = [];
  sic.addGraph = function(obj) {
    if (typeof arguments[0] === typeof(Function))
      obj = {
        generate: arguments[0],
        callback: arguments[1]
      };

    sic.render.queue.push(obj);
    if (!sic.render.active) sic.render();
  };
  sic.utils.calTextElementWidth = function(svgTextElem) {
    var text_width = 0;
    // text_width = d3.select("body").append("canvas").node().getContext("2d").measureText(d3.select(svgTextElem).text()).width;
    // d3.select("canvas").remove();
    text_width = d3.select(svgTextElem).text().length * parseInt(getComputedStyle(svgTextElem).fontSize.replace("px", "")) * 0.5;
    return isNaN(text_width) ? 0 : text_width;
  };
  /*
Snippet of code you can insert into each nv.models.* to give you the ability to
do things like:
chart.options({
  showXAxis: true,
  tooltips: true
});

To enable in the chart:
chart.options = nv.utils.optionsFunc.bind(chart);
*/
  sic.utils.optionsFunc = function(args) {
    if (args) {
      d3.map(args).forEach((function(key, value) {
        if (typeof this[key] === "function") {
          this[key](value);
        }
      }).bind(this));
    }
    return this;
  };

  sic.models.multiBar = function() {
    // Private Variables - default value
    var svg_width = 500,
      svg_height = 300,
      ticks = 5,
      vertical_line_height = 4,
      x_axis_margin_bottom = 70,
      svg_pad_left = 40,
      svg_pad_top = 50,
      svg_pad_bottom = 20,
      svg_pad_right = 20,
      chart_height = 0,
      chart_width = 0,
      height_with_padding = 0,
      grid_top = 0,
      svg_column_width = 0,
      dispatch = d3.dispatch('chartClick', 'elementClick', 'elementDblClick', 'elementMouseover', 'elementMouseout'),
      transitionduration = 1000

    var colors = d3.scale.category20();
    var ColorsRange = colors.range();
    var ColorsRange = ["#006600", "#CC0000", "#FF9900"];
    var svgNamespace = "http://www.w3.org/2000/svg";

    function calDimension() {
      chart_height = svg_height - svg_pad_top - svg_pad_bottom
      chart_width = svg_width - svg_pad_left - svg_pad_right
      height_with_padding = svg_pad_top + chart_height
      grid_top = svg_height - svg_pad_bottom
    }

    function getCategory(chartdata) {
      return (chartdata && chartdata.length > 0) ? chartdata[0].values.map(function(d, i) {
        return d.x;
      }) : []
    }

    // Draw Chart
    function chart(selection, element) {
      var categoryAxis = getCategory(selection.data);
      var chart_original = {
        data: selection.data
      };
      var categoryAxisOri = getCategory(chart_original.data);
      // initializing tooltip
      var tip = d3.tip().attr('class', 'd3-tip').direction('e')
        .html(function(d) {
          var GetColorNode = this;
          for (var i = 0; i < categoryAxis.length; i++) {
            GetColorNode = GetColorNode.previousSibling;
          }
          var colorIdx = null;
          for (var i = 0; i < ColorsRange.length; i++) {
            if (d3.select(GetColorNode).attr("fill").toLowerCase() == ColorsRange[i].toLowerCase()) {
              colorIdx = i;
              break;
            }
          }
          d3.select(".d3-tip").attr("style", d3.select(".d3-tip").attr("style") + ";background:" + ColorsRange[colorIdx] + ";border: 1px solid " + ColorsRange[colorIdx]);
          return ((d.y2 - d.y1) * 100).toFixed(2) + "% on " + chart_original.data[colorIdx].key + " (" + d.y + ")"
        });

      var svg = document.createElementNS(svgNamespace, 'svg')
      
      element.append(svg);
      svg = d3.select(svg).attr({
        d: "M" + svg_pad_left + " " + svg_pad_top + " " + (svg_width - svg_pad_right) + " " + svg_pad_top + " " + (svg_width - svg_pad_right) + " " + (svg_pad_top + chart_height) + " " + svg_pad_left + " " + (svg_pad_top + chart_height) + " z",
        fill: "none",
        width: svg_width,
        height: svg_height
      }).call(tip);
svg.on("mouseleave", tip.hide)
      var y = d3.scale.linear().range([svg_height - svg_pad_bottom, svg_pad_top])
      var yAxis = d3.svg.axis().scale(y).orient('left').tickSize(-svg_width + svg_pad_left + svg_pad_right).ticks(5).tickFormat(d3.format("%"));
      y.domain([0, 1])

      svg.append("g")
        .attr({
          "class": "y axis",
          "transform": "translate(" + svg_pad_left + ", 0)"
        })
        .call(yAxis)

      var defs = svg.append('defs');

      var clippath = defs.append("clipPath");

      var lingrad1 = defs.append('linearGradient').attr('id', 'self101').attr('gradientTransform', 'rotate(0)');
      lingrad1.append('stop').attr({
        'offset': '0%',
        'stop-color': '#fff',
        'stop-opacity': '0'
      })
      lingrad1.append('stop').attr({
        'offset': '25%',
        'stop-color': '#fff',
        'stop-opacity': '0.3'
      })
      lingrad1.append('stop').attr({
        'offset': '100%',
        'stop-color': '#fff',
        'stop-opacity': '0'
      });

      var pathSVG = svg.append("path").attr({d: "M0 0 " + svg_width + " 0 " + svg_width + " " + svg_height + " 0 " + svg_height + " z"});

      var pathBarChart = svg.append("path");

      var firstg = svg.append("g").attr("id", "self135");

      var barsg = firstg.append("g").attr("clip-path", "url('#self100')");

      reconstructData();

      function reconstructData() {
        categoryAxis = getCategory(selection.data);
        // Sub total of each category
        var subtotal = [];
        chart_original.data.forEach(function(d, i) {
          d.values.forEach(function(value, key) {
            if (!subtotal[value.x]) subtotal[value.x] = 0;
            subtotal[value.x] += value.y;
          });
        });
        // built path
        selection.data.forEach(function(d, i) {
          var y0 = 0;
          d.values.forEach(function(value, key) {
            d.values[key].y1 = i > 0 ? selection.data[i - 1].values[key].y2 : 0;
            d.values[key].y2 = d.values[key].y1 + value.y / subtotal[value.x];
          });
        });
      }

      // draw x-axis-line
      firstg.append("path").attr({
        class: "xline",
        d: "M" + svg_pad_left + " " + (svg_pad_top + chart_height) + " " + (svg_width - svg_pad_right) + " " + (svg_pad_top + chart_height) + "z",
        stroke: "#8e8e8e"
      });

      update();

      function update() {
        categoryAxis = getCategory(selection.data);
        svg_column_width = chart_width / categoryAxisOri.length;
        updateBarColumn();
        updateXAxis();

        function updateBarColumn() {
          // draws stacked bar column here
          barsg.selectAll("g").remove();
          for (var key = selection.data.length - 1; key >= 0; key--) {
            var values = selection.data[key]
            var series = barsg.append("g").selectAll("path").data(values.values);

            var seriesEnter = series.enter();
            seriesEnter.append("path").attr({
              d: function(d, i) {
                var x1 = (svg_pad_left + svg_column_width * (i + 30 / 100));
                var y1 = (chart_height + svg_pad_top - d.y2 * chart_height);
                var x2 = x1 + 40 / 100 * svg_column_width,
                  y2 = y1
                var x3 = x2,
                  x4 = x1,
                  y3 = grid_top,
                  y4 = y3;
                return "M" + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3 + " " + x4 + " " + y4 + "z"
              },
              class: "barcol",
              
              fill: function() {
                var colorIdx = 0;
                chart_original.data.forEach(function(data, idx) {
                  if (data.key == values.key) {
                    colorIdx = idx;
                    return;
                  }
                });
                return ColorsRange[colorIdx]
              }
            });


            seriesEnter.append("path").attr({
              d: function(d, i) {
                var x1 = (svg_pad_left + svg_column_width * (i + 30 / 100)),
                  x4 = x1;
                var y1 = (chart_height + svg_pad_top - d.y2 * chart_height),
                  y2 = y1;
                var x2 = x1 + 40 / 100 * svg_column_width,
                  x3 = x2;
                var y3 = (chart_height + svg_pad_top - d.y1 * chart_height),
                  y4 = y3;
                return "M" + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3 + " " + x4 + " " + y4 + "z"
              },
              class: "barGrad"
            }).on("mouseover", function(d) {
              var currentBar = this;
              // Create transparent layer for bar column
              d3.select(".highlightBar").remove();
              barsg.append("path").attr({
                class: "highlightBar",
                d: d3.select(currentBar).attr("d")
              });
            }).on("mouseenter", tip.show);
          };
          barsg.selectAll("path").transition().delay(50).duration(transitionduration).attrTween("d", function(d, i, a) {
            return function(t) {
              var coordinate = a.substr(1, a.length - 2).trim().replace(/L /g, "").split(" ");
              coordinate[1] = coordinate[3] = coordinate[7] - t * (coordinate[7] - coordinate[1])
              return "M" + coordinate.join(" ") + "z";
            }
          });
        }

        function updateXAxis() {
          // vertical line for x-axis
          firstg.selectAll(".verXLine").remove();
          firstg.selectAll("svg")
            .data(categoryAxisOri.concat([""]))
            .enter().append("line")
            .attr({
              class: "verXLine",
              x1: function(d, i) {
                return (i) * svg_column_width + svg_pad_left
              },
              y1: svg_height - svg_pad_bottom,
              x2: function(d, i) {
                return (i) * svg_column_width + svg_pad_left
              },
              y2: svg_height - svg_pad_bottom + vertical_line_height

            })

          // draw x-axis-text 
          firstg.selectAll(".textXaxis").remove();
          firstg.selectAll("text")
            .data(categoryAxisOri)
            .enter().append("text").text(function(d) {
              return d;
            }).attr({
              class: "textXaxis",
              x: function(d, i) {
                return svg_pad_left + (i + 1) * svg_column_width - (svg_column_width / 2) - (sic.utils.calTextElementWidth(this) / 2)
              },
              y: height_with_padding + 20
            });
        }
      }

      var legendG = svg.append("g").on("mouseout", tip.hide)
      var legendEnter = legendG.selectAll("path").data(selection.data).enter();
      legendEnter.append("path").attr({
        cursor: "pointer",
        d: function(d, i) {
          var x1 = 40 + (i + 1) * 100,
            x4 = x1;
          var x2 = 40 + (i + 1) * 100 + 8,
            x3 = x2;
          var y1 = 17,
            y2 = y1;
          var y3 = 25,
            y4 = y3;
          return "M" + x1 + " " + y1 + " " + x2 + " " + y2 + " " + x3 + " " + y3 + " " + x4 + " " + y4 + "z";
        },
        class: "slegend",
        fill: function(d, i) {
          return ColorsRange[i]
        }
      }).on("click", function(e, f) {
        var legend = d3.select(this);
        legend.attr("fill", legend.attr("fill") === "black" ? ColorsRange[f] : "black");
        // filter by legend 
        selection.data = [];
        d3.selectAll(".slegend")[0].forEach(function(value, key) {
          if (d3.select(value).attr("fill") !== "black") {
            selection.data.push(chart_original.data[key]);
          }
        });

        reconstructData();
        update();
      });
      legendEnter.append("text").attr({
        class: "stext",
        x: function(d, i) {
          return (i + 1) * 100 + 50
        },
        y: "25"
      }).text(function(d) {
        return d.key
      });
      return chart;
    }

    // Expose Public Variables
    chart.dispatch = dispatch;
    chart.width = function(_) {
      if (!arguments.length) return svg_width;
      svg_width = _;
      calDimension()
      return chart;
    };

    chart.height = function(_) {
      if (!arguments.length) return svg_height;
      svg_height = _;
      calDimension()
      return chart;
    };

    chart.ticks = function(_) {
      if (!arguments.length) return ticks;
      ticks = _;
      return chart;
    };

    chart.colors = function(_) {
      if (!arguments.length) return ColorsRange;
      ColorsRange = _;
      return chart;
    };

    //chart.options = sic.utils.optionsFunc.bind(chart);
    chart.padding = function(_) {
      if (!arguments.length) return padding;
      svg_pad_top = typeof _.top != 'undefined' ? _.top : svg_pad_top;
      svg_pad_right = typeof _.right != 'undefined' ? _.right : svg_pad_right;
      svg_pad_bottom = typeof _.bottom != 'undefined' ? _.bottom : svg_pad_bottom;
      svg_pad_left = typeof _.left != 'undefined' ? _.left : svg_pad_left;
      calDimension()
      return chart;
    };
    chart.container = function(_) {
      container = _
      return chart;
    };
    return chart;
  }
})();