// ban rate visualization module
(function() {
	var margin = {
		top: 50,
		right: 50,
		bottom: 100,
		left: 50
	};
	
	var width = 600 - margin.left - margin.right;
	var height = 300 - margin.bottom - margin.top;
	var x = d3.scale.ordinal().rangeBands([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var svg = d3.select("#ban-div").append("svg").attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	}).append("g").attr({
		transform: "translate(" + margin.left + "," + margin.top + ")"
	});

	var lineFunction = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.percent); })
	.interpolate("linear");

	var dataSet;
	var xAxisG;
	var yAxisG;
	d3.json("data/ban_rates.json", function(error, json) {
		if (error) return console.warn(error);
		
		dataSet = json;
		for (champion in dataSet) {
			for (var i = 0; i < dataSet[champion].length; i++) {
				dataSet[champion][i].percent /= 100;
			}
		}
		window.updateBanRateViz("Kassadin");
	});

	// updates ban rate visualization when user selects a new champion
	var banG;
	window.updateBanRateViz = function(championName) {
		var championData = dataSet[championName];
		// clear previous graph and make a new one
		if (banG != undefined)
			banG.remove();
		banG = svg.append("g")
		.attr("id", "ban-g")
		
		// update domains
		x.domain(championData.map(function(d) { return d.date; }));
		y.domain([0, 0.02 + d3.max(championData, function(d) { return d.percent; })]);
		
		// draw x axis
		xAxisG = svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

		// draw y axis
		yAxisG = svg.append("g")
		.attr("class", "y axis");
		
		// select x tick values to display, since displaying all of them leads to clutter
		var tickVals = []
		var xDomain = x.domain();
		for (var i = 0; i < xDomain.length; i++) {
			if (i % 2 == 0) {
				tickVals.push(xDomain[i]);
			}
		}
		
		// update x axis
		var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickValues(tickVals);
		xAxisG.call(xAxis)
		.selectAll("text")  
		.style("text-anchor", "end")
		.attr("dx", "-.8em")
		.attr("dy", ".15em")
		.attr("transform", function(d) {
			return "rotate(-65)" 
		});
		
		// update y axis
		var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format("%"));
		yAxisG.call(yAxis);
		 	
		// draw ban rate line
		banG.append("path")
		.attr("class", "line")
		.attr("d", function() { return lineFunction(championData); });
		
		// draw ban rate points
		banG.append("g")
		.selectAll(".point")
		.data(championData)
		.enter().append("circle")
		.attr("fill-opacity", 0.8)
		.attr("fill", "steelblue")
		.attr("r", 3)
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y(d.percent); })
		.on("mouseover", function(d, i) {
			d3.select("#tooltip").remove();
			var mouseCoordinates = d3.mouse(svg.node());
			var tooltip = svg.append("g")
			.attr("id", "tooltip")
			.attr("transform", "translate(" + (mouseCoordinates[0]+5) + "," + (mouseCoordinates[1]+30) + ")");
			tooltip
			.append("svg:rect")
			.attr("width", "95px")
			.attr("height", "50px")
			.attr("y", "-20px")
			.style("fill", "lightgray");
			tooltip
			.append("text")
			.text("Consensus value:")
			.attr("fill", "black");
			tooltip
			.append("text")
			.text(Math.round(d.population).toString().replace(/(\d{1,3})(?=(?:\d{3})+$)/g,"$1,"))
			.attr("fill", "black")
			.attr("y", "20px");
		})
		.on("mouseout", function() {
			d3.select("#tooltip").remove();
		});
	};
		/*.on("mouseover", function(d, i) {
			d3.select("#tooltip").remove();
			var mouseCoordinates = d3.mouse(svg.node());
			var tooltip = svg.append("g")
			.attr("id", "tooltip")
			.attr("transform", "translate(" + (mouseCoordinates[0]+5) + "," + (mouseCoordinates[1]+30) + ")");
			tooltip
			.append("svg:rect")
			.attr("width", "95px")
			.attr("height", "50px")
			.attr("y", "-20px")
			.style("fill", "lightgray");
			tooltip
			.append("text")
			.text("Consensus value:")
			.attr("fill", "black");
			tooltip
			.append("text")
			.text(Math.round(d.population).toString().replace(/(\d{1,3})(?=(?:\d{3})+$)/g,"$1,"))
			.attr("fill", "black")
			.attr("y", "20px");
		})
		.on("mouseout", function() {
			d3.select("#tooltip").remove();
		})*/
}());

