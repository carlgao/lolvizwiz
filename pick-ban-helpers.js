var dataForDate = function(date, championData) {
	for (x in championData) {
		if (championData[x].date == date) {
			return championData[x];
		}
	}
};

var generatePointId = function(prefix, date) {
	return prefix + date.replace(/ /g, "").replace(",", "");
};

var pickAndBanVizTemplate = function(title, prefix, dataSource, updateFunctionName, correspondingHighlightName, correspondingStopHighlightName, highlightName, stopHighlightName) {
	var margin = {
		top: 50,
		right: 50,
		bottom: 100,
		left: 50
	};
	
	var width = 550 - margin.left - margin.right;
	var height = 300 - margin.bottom - margin.top;
	var x = d3.scale.ordinal().rangeBands([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	var svg = d3.select("#" + prefix + "-div").append("svg").attr({
		width: width + margin.left + margin.right,
		height: height + margin.top + margin.bottom
	})
	.append("g").attr({
		transform: "translate(" + margin.left + "," + margin.top + ")"
	});
	
	svg.append("text")
	.text(title)
	.attr("class", "graph-title")
	.attr("fill", "#DDDDDD")
	.attr("y", "-25px");

	var lineFunction = d3.svg.line()
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.percent); })
	.interpolate("linear");

	var dataSet;
	var championData;
	var xAxisG;
	var yAxisG;
	d3.json(dataSource, function(error, json) {
		if (error) return console.warn(error);
		
		dataSet = json;
		for (champion in dataSet) {
			for (var i = 0; i < dataSet[champion].length; i++) {
				dataSet[champion][i].percent /= 100;
			}
		}
	});

	// updates visualization when user selects a new champion
	var g;
	window[updateFunctionName] = function(championName) {
		championData = dataSet[championName];
		// clear previous graph and make a new one
		if (g != undefined)
			g.remove();
		g = svg.append("g")
		.attr("id", prefix + "-g");
		
		// update domains
		x.domain(championData.map(function(d) { return d.date; }));
		yMax = 0.01 + d3.max(championData, function(d) { return d.percent; });
		y.domain([0, yMax]);
		
		// draw x axis
		xAxisG = g.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")");

		// draw y axis
		yAxisG = g.append("g")
		.attr("class", "y axis");
		
		// select x tick values to display, since displaying all of them leads to clutter
		var tickVals = []
		var xDomain = x.domain();
		var m = Math.floor(xDomain.length / 15);
		console.log(m);
		for (var i = 0; i < xDomain.length; i++) {
			if (i % m == 0) {
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
		.ticks(Math.min(yMax*100, 10))
		.tickFormat(d3.format("%"));
		yAxisG.call(yAxis);
		 	
		// draw line
		g.append("path")
		.attr("class", "line")
		.attr("d", function() { return lineFunction(championData); });
		
		// draw points
		g.append("g")
		.attr("id", prefix + "-points")
		.selectAll(".point")
		.data(championData)
		.enter().append("circle")
		.attr("id", function(d) { return generatePointId(prefix, d.date); })
		.attr("fill-opacity", 0.8)
		.attr("fill", "steelblue")
		.attr("r", 3)
		.attr("cx", function(d) { return x(d.date); })
		.attr("cy", function(d) { return y(d.percent); })
		.on("mouseover", function(d, i) {
			var thisPoint = d3.select(this);
			thisPoint
			.attr("r", 5)
			.attr("stroke", "white");
			
			d3.select("#tooltip").remove();
			var tooltip = svg.append("g")
			.attr("id", "tooltip")
			.attr("transform", "translate(" + (thisPoint.attr("cx")) + "," + (parseInt(thisPoint.attr("cy")) + 30) + ")");
			tooltip
			.append("svg:rect")
			.attr("width", function() { return (d.percent >= 0.1) ? "57px" : "50px"; })
			.attr("height", "30px")
			.attr("x", "-25px")
			.attr("y", "-70px")
			.attr("rx", "5px")
			.attr("ry", "5px")
			.style("fill", "black")
			.style("fill-opacity", 0.5);
			tooltip
			.append("text")
			.text(d3.format(".2%")(d.percent))
			.attr("fill", "#DDDDDD")
			.attr("x", "-17px")
			.attr("y", "-50px");
			
			window[correspondingHighlightName](d.date);
		})
		.on("mouseout", function(d, i) {
			d3.select("#tooltip").remove();
			var thisPoint = d3.select(this);
			thisPoint
			.attr("r", 3)
			.attr("stroke", "none");
			window[correspondingStopHighlightName]();
		});
	};
	
	var correspondingPoint;
	window[highlightName] = function(date) {
		var d = dataForDate(date, championData);
		
		correspondingPoint = d3.select("#" + generatePointId(prefix, date));
		if (correspondingPoint.empty()) {
			return;
		}
		correspondingPoint
		.attr("r", 5)
		.attr("stroke", "white");
		
		d3.select("#tooltip2").remove();
		var tooltip2 = svg.append("g")
		.attr("id", "tooltip2")
		.attr("transform", "translate(" + (correspondingPoint.attr("cx")) + "," + (parseInt(correspondingPoint.attr("cy")) + 30) + ")");
		tooltip2
		.append("svg:rect")
		.attr("width", function() { return (d.percent >= 0.1) ? "57px" : "50px"; })
		.attr("height", "30px")
		.attr("x", "-25px")
		.attr("y", "-70px")
		.attr("rx", "5px")
		.attr("ry", "5px")
		.style("fill", "black")
		.style("fill-opacity", 0.5);
		tooltip2
		.append("text")
		.text(d3.format(".2%")(d.percent))
		.attr("fill", "#DDDDDD")
		.attr("x", "-17px")
		.attr("y", "-50px");
	};
	window[stopHighlightName] = function() {
		d3.select("#tooltip2").remove();
		correspondingPoint
		.attr("r", 3)
		.attr("stroke", "none");
	}
};
