class ClanStat {
	constructor(u){
		$.getScript( u )
		  .done(this.onDataLoad.bind(this))
		  .fail(function( jqxhr, settings, exception ) {
			alert('Data load Error');
		});
		$('.chart_init_btn').click(this.onChatInitBtnClick.bind(this));
	}
	
	onDataLoad(){
		this.createTable();
		this.renderChestBar();
		//this.createCharts();
	}
	
	renderChestBar(){
		var chests = [20000,
					50000,
					100000,
					200000,
					300000,
					600000,
					900000,
					1500000,],
			chest_max =chests[chests.length-1],
			ghost_bars = [],
			bars = [],
			clan_keys = clan_data.keys,
			clan_keys_predict = clan_data.keys_predict,
			last_ghost_bar_width = 0;
		chests.forEach((chest, chest_index)=>{
			let ghost_bar = $('<div role="progressbar"></div>');
			ghost_bar.addClass('progress-bar chest-ghost-bar chest-bg-'+(chest_index+1));
			var ghost_bar_width = Math.round((chest-(chests[chest_index-1]?chests[chest_index-1]:0))/chest_max*100,2);
			ghost_bar.css({width:ghost_bar_width+'%', left:last_ghost_bar_width+'%'});
			last_ghost_bar_width += ghost_bar_width;
			ghost_bar.html(chest_index+1);
			ghost_bars.push(ghost_bar);
			let bar = $('<div role="progressbar"></div>');
			bar.addClass('progress-bar chest-bg-'+(chest_index+1));
			bar.html(chest_index+1);
			if(chest<clan_keys){
				bar.css({width: Math.round((chest-(chests[chest_index-1]?chests[chest_index-1]:0))/chest_max*100,2)+'%'});
			}else{
				bar.css({width: Math.round((clan_keys-(chests[chest_index-1]?chests[chest_index-1]:0))/chest_max*100,2)+'%'});
				bar.addClass('progress-bar-striped progress-bar-animated');
			}
			bars.push(bar);
		});
		$('#clanstat_chest_bar').append(ghost_bars);
		let ghost_bar_predict = $('<div role="progressbar"></div>');
		ghost_bar_predict.addClass('progress-bar chest-ghost-bar chest-bg-predict progress-bar-striped progress-bar-animated');
		ghost_bar_predict.css({width:Math.round(clan_keys_predict/chest_max*100,2)+'%',});
		$('#clanstat_chest_bar').append(ghost_bar_predict);
		$('#clanstat_chest_bar').append(bars);
		$('#clanstat_chest_keys').html(clan_data.keys);
		$('#clanstat_chest_keys_pd').html(clan_data.keys_pd);
		if(clan_data.keys_pd<clan_data.keys_pd_need){
			$('#clanstat_chest_keys_pd_need').html('&nbsp;('+Math.round(clan_data.keys_pd_need-clan_data.keys_pd)+')');
			$('#clanstat_chest_keys_pd').addClass('text-danger');
			$('#clanstat_chest_keys_pd_need').addClass('text-danger');
		}else{
			$('#clanstat_chest_keys_pd_need').html('');
			$('#clanstat_chest_keys_pd').addClass('text-success');
		}
		$('#clanstat_chest_keys_predict').html(clan_data.keys_predict);
		
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
	
	onChatInitBtnClick(e){
		var btn = $(e.currentTarget);
		btn.slideUp();
		$('#clan_members_'+btn.data('id')+'_chart').show();
		this.createChart('clan_members_'+btn.data('id')+'_chart', chart_data[btn.data('id')]);
	}
	
	createChart(id, data){
		var root = am5.Root.new(id);
		root.container.set({
			paddingBottom:0,
			paddingTop:0,
			paddingLeft:0,
			paddingRight:0,
		})
		root.setThemes([
		  am5themes_Animated.new(root)
		]);
		var chart = root.container.children.push(am5xy.XYChart.new(root, {
			layout: root.verticalLayout,
			panX: true,
			panY: false,
			wheelX: "panX",
			wheelY: "zoomX",
			maxTooltipDistance: 0,
			pinchZoomX:true
		}));

		var xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
		  baseInterval: {
			timeUnit: "day",
			count: 1
		  },
		  renderer: am5xy.AxisRendererX.new(root, {}),
		  tooltip: am5.Tooltip.new(root, {}),
		  groupData: true,
		  groupCount: $(window).width()>500?500:20,
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


		chart.set("scrollbarX", am5.Scrollbar.new(root, {
		  orientation: "horizontal"
		}));

		/*chart.set("scrollbarY", am5.Scrollbar.new(root, {
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
			  height: am5.percent(40),
			  width: am5.percent(100),
			  verticalScrollbar: am5.Scrollbar.new(root, {
				orientation: "vertical"
			  })
		}));
		legend.labels.template.setAll({
		  fontSize: 12,
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