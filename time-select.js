window.lineChartsLoadedCount = 0;
window.chartXs = [];
window.initTimeSelect = function() {
	if (window.timeSelectSvg != undefined) {
		window.timeSelectSvg.remove();
	}
	var margin = {
		top: 50,
		right: 40,
		bottom: 50,
		left: 40
	};

	var width = 550 - margin.left - margin.right;
	var height = 110 - margin.bottom - margin.top;
	var x = d3.scale.ordinal().rangeBands([0, width]);
	var y = d3.scale.linear().range([height, 0]);
	
	var xDomain = chartXs[0].domain();
	x.domain(xDomain);
	
	var tickVals = []
	var m = Math.floor(xDomain.length / 20);
	if (m == 0) m = 1;
	for (var i = 0; i < xDomain.length; i++) {
		if (i % m == 0) {
			tickVals.push(xDomain[i]);
		}
	}
	
	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickValues(tickVals);
	
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(0);


	var brushed = function() {
		for (i in window.chartXs) {
			chartX = window.chartXs[i];
			var extent = brush.extent();
			var min = extent[0];
			var max = extent[1];
			var selected = x.domain().filter(function(d) { return x(d) >= min && x(d) <= max; });
			chartX.domain(brush.empty() ? x.domain() : selected);
		}
		window.brushWin();
		window.brushPick();
		window.brushBan();
	};

	var brush = d3.svg.brush()
		.x(x)
		.on("brush", brushed);
	window.brush = brush;

	window.timeSelectSvg = d3.select("#time-select-div").append("svg").attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	});
	
	var svg = window.timeSelectSvg.append("g").attr({
		transform: "translate(" + margin.left + "," + margin.top + ")"
	});
	
	svg.append("defs").append("clipPath")
	.attr("id", "clip")
	.append("rect")
	.attr("width", width)
	.attr("height", height);

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis)
	.selectAll("text")  
	.style("text-anchor", "end")
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", function(d) {
		return "rotate(-65)" 
	});
	
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

	svg.append("g")
	.attr("class", "x brush")
	.call(brush)
	.selectAll("rect")
	.attr("y", -6)
	.attr("height", height + 7);
	
	svg.append("text")
	.text("Time Range Selector")
	.attr("class", "graph-title")
	.attr("fill", "#DDDDDD")
	.attr("y", "-25px");
	
	svg.select(".brush .background")
	.style("visibility", "visible");
};
