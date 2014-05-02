d3.json("data/bot_lane_synergy_popularity.json", function(json) {
	var names = json["adc"].map(function(dict) { return dict["name"]; }).concat(json["supports"].map(function(dict) { return dict["name"]; }));
	var preMatrix = json["adc"].map(function(dict) { return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].concat(dict["dataSize"]); });
	var matrix = preMatrix.slice(0);
	for (var j = 12; j < preMatrix[0].length; j++) {
		var arr = []
		for (var i = 0; i < preMatrix.length; i++) {
			arr.push(preMatrix[i][j])
		}
		matrix.push(arr.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
	}

	for (var i = 0; i < matrix.length; i++) {
		var s = "";
		for (var j = 0; j < matrix[i].length; j++) {
			s += matrix[i][j] + "\t";
		}
	}
	var chord = d3.layout.chord()
	.padding(.05)
	.sortSubgroups(d3.descending)
	.matrix(matrix);
	
	var margin = {
		top: 70,
		right: 0,
		bottom: 70,
		left: 0
	};
	
	var width = 960 - margin.left - margin.right,
    height = 600 - margin.bottom - margin.top,
    innerRadius = Math.min(width, height) * .41,
    outerRadius = innerRadius * 1.1;

	var fill = d3.scale.ordinal()
    .domain(d3.range(27))
    .range(["#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#CC2222", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC", "#2222CC"]);
	
	var svg = d3.select("#chord-div").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.bottom + margin.top)
	.append("g")
		.attr("transform", "translate(" + width / 2 + "," + (height / 2 + margin.top) + ")");

	svg.append("g").selectAll("path")
    .data(chord.groups)
	.enter().append("path")
		.style("fill", function(d) { return fill(d.index); })
		.style("stroke", function(d) { return fill(d.index); })
		.attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
		.on("mouseover", fade(.1))
		.on("mouseout", fade(1));
	var ticks = svg.append("g").selectAll("g")
    .data(chord.groups)
	.enter().append("g").selectAll("g")
    .data(groupTicks)
	.enter().append("g")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + outerRadius + ",0)";
    });

	/*ticks.append("line")
	.attr("x1", 1)
	.attr("y1", 0)
	.attr("x2", 5)
	.attr("y2", 0)
	.style("stroke", "#000");

	ticks.append("text")
	.attr("x", 8)
	.attr("dy", ".35em")
	.attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
	.attr("fill", "#DDDDDD")
	.style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
	.text(function(d) { return d.label; });*/

	svg.append("g")
	.attr("class", "chord")
	.selectAll("path")
	.data(chord.chords)
	.enter().append("path")
	.attr("d", d3.svg.chord().radius(innerRadius))
	.style("fill", "#AAD0FF")
	.style("opacity", 1);
	
	var textLabel = d3.scale.ordinal().range(
		["Caitlyn", "Lucian", "Jinx", "Twitch", "Vayne", "Ezreal", "Draven", "Graves", "Sivir", "Tristana", "Varus", "Miss Fortune", "Thresh", "Leona", "Blitzcrank", "Soraka", "Annie", "Karma", "Lulu", "Sona", "Nami", "Fiddlesticks", "Janna", "Alistar"]
	);
	svg.append("g").selectAll("text")
        .data(chord.groups)
    .enter()
    .append("svg:text")
		.attr("transform", function(d) {
			return "rotate(" + (d.startAngle * 180 / Math.PI - 90) + ")"
			+ "translate(" + (innerRadius-60) + ",0)";
		})
        .attr("x", 100)
        .attr("dy", 15)
		.text(function(d,i) {return textLabel(i+1);})
		.attr("fill", "#DDDDDD");

	// From http://bl.ocks.org/mbostock/4062006
	// Returns an array of tick angles and labels, given a group.
	function groupTicks(d) {
		var k = (d.endAngle - d.startAngle) / d.value;
		return d3.range(0, d.value, 1000).map(function(v, i) {
			return {
				angle: v * k + d.startAngle,
				label: i % 100 ? null : v / 1000 + "k"
			};
		});
	}

	// Returns an event handler for fading a given chord group.
	function fade(opacity) {
		return function(g, i) {
			svg.selectAll(".chord path")
			.filter(function(d) { return d.source.index != i && d.target.index != i; })
			.transition()
			.style("opacity", opacity);
		};
	}
});
