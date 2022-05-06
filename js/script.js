class ClanStat {
	constructor(u){
		$.getScript( u )
		  .done(this.onDataLoad.bind(this))
		  .fail(function( jqxhr, settings, exception ) {
			alert('Data load Error');
		});
	}
	
	onDataLoad(){
		this.createTable();
		this.createCharts();
	}
	
	createTable(){
		$('#clanstat_table').DataTable( {
			responsive: true,
			data: table_data,
			columns: table_header,
			order: [[ table_header.length-1, "desc" ]],
			pageLength: 50,
			dom:'ft',
		} );
	}
	
	createCharts(){
		this.createChart('clan_members_power_chart', chart_data.power);
		this.createChart('clan_members_rating_chart', chart_data.rating);
		this.createChart('clan_members_donations_chart', chart_data.donations);
	}
	
	createChart(id, data){
		var root = am5.Root.new(id);
		root.setThemes([
		  am5themes_Animated.new(root)
		]);
		var chart = root.container.children.push(am5xy.XYChart.new(root, {
			layout: root.verticalLayout,
			panX: true,
			panY: true,
			wheelX: "panX",
			wheelY: "zoomX",
			maxTooltipDistance: 0,
			pinchZoomX:true
		}));

		var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		  maxDeviation: 0.2,
		  baseInterval: {
			timeUnit: "day",
			count: 1
		  },
		  renderer: am5xy.AxisRendererX.new(root, {}),
		  tooltip: am5.Tooltip.new(root, {})
		}));

		var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
		  renderer: am5xy.AxisRendererY.new(root, {})
		}));
		
		data.forEach(u => {
		  var series = chart.series.push(am5xy.LineSeries.new(root, {
			name: u.name,
			xAxis: xAxis,
			yAxis: yAxis,
			valueYField: "value",
			valueXField: "date",
			legendValueText: "{valueY}",
			tooltip: am5.Tooltip.new(root, {
			  pointerOrientation: "horizontal",
			  labelText: u.name +": {valueY}"
			})
		  }));

		  series.data.setAll(u.data);
		  series.appear();
		});

		var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
		  behavior: "none"
		}));
		cursor.lineY.set("visible", false);


		/*chart.set("scrollbarX", am5.Scrollbar.new(root, {
		  orientation: "horizontal"
		}));

		chart.set("scrollbarY", am5.Scrollbar.new(root, {
		  orientation: "vertical"
		}));*/


		var legend = chart.children.push(am5.Legend.new(root, {
			paddingTop: 15,
			centerX: am5.percent(50),
			  x: am5.percent(50),
			  layout: am5.GridLayout.new(root, {
				maxColumns: 6,
				fixedWidthGrid: true
			  }),
			  height: am5.percent(30),
			  verticalScrollbar: am5.Scrollbar.new(root, {
				orientation: "vertical"
			  })
		}));
		legend.labels.template.setAll({
		  fontSize: 10,
		});

		/*	legend.itemContainers.template.events.on("pointerover", function(e) {
		  var itemContainer = e.target;
		  var series = itemContainer.dataItem.dataContext;

		  chart.series.each(function(chartSeries) {
			if (chartSeries != series) {
			  chartSeries.strokes.template.setAll({
				strokeOpacity: 0.15,
				stroke: am5.color(0x000000)
			  });
			} else {
			  chartSeries.strokes.template.setAll({
				strokeWidth: 3
			  });
			}
		  })
		})

		legend.itemContainers.template.events.on("pointerout", function(e) {
		  var itemContainer = e.target;
		  var series = itemContainer.dataItem.dataContext;

		  chart.series.each(function(chartSeries) {
			chartSeries.strokes.template.setAll({
			  strokeOpacity: 1,
			  strokeWidth: 1,
			  stroke: chartSeries.get("fill")
			});
		  });
		})

		legend.itemContainers.template.set("width", am5.p100);
	legend.valueLabels.template.setAll({
		  width: am5.p100,
		  textAlign: "right"
		});*/
		
		legend.data.setAll(chart.series.values);
		chart.appear(1000, 100);
	}
}