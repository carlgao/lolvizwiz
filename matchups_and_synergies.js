// matchups and synergies visualization module
(function() {
	var margin = {
		top: 70,
		right: 10,
		bottom: 10,
		left: 10
	},
	width = 500 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
	
	var svg;
	window.updateSynergyAndMatchupViz = function(name) {
		var datatest = []
		var matchups = []
		var synergies = []
		d3.json("data/champion_synergies_and_matchups.json", function(error, json) {
			if (error) return console.warn(error);
		
			datatest = json[name][0];

			var d = datatest['goodmatchups'];
			var e = datatest['badmatchups']
			Object.keys(datatest['goodmatchups']).forEach(function(key, i){
				var value = d[key]
				var obj = {name: key, value: value};
				matchups.push(obj);
			});
			Object.keys(datatest['badmatchups']).forEach(function(key, i){
				var value = e[key]
				var num = 100 - parseFloat(e[key])
				var obj = {name: key, value: num.toString()};
				matchups.push(obj);
			});
			
			matchups.sort(function(a, b) {return d3.descending(a["value"], b["value"]);});
			var m_a_to_z = 1;

			var f = datatest['goodsynergies'];
			var g = datatest['badsynergies'];
			Object.keys(datatest['goodsynergies']).forEach(function(key, i){
				var value = f[key]
				var obj = {name: key, value: value};
				synergies.push(obj);
			});
			Object.keys(datatest['badsynergies']).forEach(function(key, i){
				var value = g[key]
				var num = 100 - parseFloat(g[key])
				var obj = {name: key, value: num.toString()};
				synergies.push(obj);
			});

			synergies.sort(function(a, b) {return d3.descending(a["value"], b["value"]);});	
			var s_a_to_z = 1;

			var x = d3.scale.linear()
				.range([0, width])

			var y = d3.scale.ordinal()
				.rangeRoundBands([0, height], .2);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("top")
				.tickFormat(function(d) { return d + "%"; });

			function transition(type) {
				if (type == "matchups") {
					if (m_a_to_z == 0) {
						matchups.sort(function(a, b) {return d3.descending(a["value"], b["value"]);});
						y.domain(matchups.map(function (d) {
							return d.name;
						}));
						m_a_to_z = 1;
					}
					else if (m_a_to_z == 1) {
						matchups.sort(function(a, b) {return d3.ascending(a["name"], b["name"]);});
						y.domain(matchups.map(function (d) {
							return d.name;
						}));
						m_a_to_z = 0
					}

					matchupgroup
			          .transition()
			          .duration(750)
			          .delay(function(d, i) { return i * 50; })
			          .attr("transform", function(d, i) { 
			            return "translate(0," + y(d.name) + ")";
			        });
		      	}
		      	else if (type == "synergies") {
		      		if (s_a_to_z == 0) {
						synergies.sort(function(a, b) {return d3.descending(a["value"], b["value"]);});
						y.domain(synergies.map(function (d) {
							return d.name;
						}));
						s_a_to_z = 1;
					}
					else if (s_a_to_z == 1) {
						synergies.sort(function(a, b) {return d3.ascending(a["name"], b["name"]);});
						y.domain(synergies.map(function (d) {
							return d.name;
						}));
						s_a_to_z = 0
					}

					synergygroup
			          .transition()
			          .duration(750)
			          .delay(function(d, i) { return i * 50; })
			          .attr("transform", function(d, i) { 
			            return "translate(0," + y(d.name) + ")";
			        });
		      	}
			}

			document.getElementById("matchup-div").innerHTML = "";
			document.getElementById("synergy-div").innerHTML = "";
			svg = d3.select("#matchup-div").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var title1 = "Best/Worst Matchups Win Rate"
			var title2 = "Best/Worst Synergies Win Rate"

			svg.append("text")
			.text(title1)
			.attr("class", "graph-title")
			.attr("fill", "#DDDDDD")
			.attr("y", "-40px")
			.attr("x", "80px");

			x.domain([40,60])
			y.domain(matchups.map(function (d) {
				return d.name;
			}));

			var matchupgroup = svg.append("g")
		        .selectAll("g")
		        .data(matchups)
		        .enter()
		        .append("g")
		        .attr("transform", function(d, i) { return "translate(0, " + y(d.name) +")"; });

			matchupgroup.append("rect")
				.attr("fill", function(d, i){
					if (d['value'] < 50) {
						return "#EE2C2C"
					}
					else return "#9CCB19"
				})
				.attr("class", "bar")
				.attr("x", function (d) {
					if (x(d.value) - x(50) < 0) {
						return (x(Math.min(0, d.value)) + (x(d.value) - x(50)));
					}
					else {
						return x(Math.min(0, d.value));
					}
				})
				.attr("width", function (d) {
					return Math.abs(x(d.value) - x(50));
				})
				.attr("height", y.rangeBand())
				.attr("transform", "translate(" + width/0.4 + ", 0)");

			matchupgroup.append("text")
			   .text(function(d) {
					var text = d.name + ", " + d.value + "%";
					return text;
			   })
			   .attr("x", function(d, i) {
			   		var num = parseFloat(d['value'])
					if (num < 50) {
						return x(Math.min(0, d['value'])) + 12;
					}
					else {
						return x(Math.min(0, d['value'])) - 12;
					}
			   })
			   .attr("text-anchor", function(d,i){
					var num = parseFloat(d['value'])
					if (num < 50) {
						return "start";
					}
					else {
						return "end";
					}
			   })
			   .attr("transform", "translate(" + width/0.4 + "," + 25 + ")")
			   .attr("fill", "white");

			svg.append("g")
				.attr("class", "x axis")
				.call(xAxis);

			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + width/0.4 + ", 0)")
				.append("line")
				.attr("x1", x(0))
				.attr("x2", x(0))
				.attr("y2", height);   

			var toggle = svg.append("g")
							.attr("class", "toggle")
							.attr("x", -2)
		        			.attr("y", -46)
		    
		    toggle.append("text")
		    	.attr("class", "toggle")
		    	.attr("y", -46)
		        .style("fill", "white")
		        .style("font-family", "Source Sans Pro")
		        .text("A-Z / Percent");

			toggle.append("rect")
				.attr("width", 80)
		        .attr("height", 30)
		        .attr("x", -10)
		        .attr("y", -65)
		        .style("fill", "none")
		        .style("stroke", "white");

		    toggle.on("click", mtransition);

			function type(d) {
				d.value = +d.value;
				return d;
			}

			var x1 = d3.scale.linear()
				.range([0, width])

			var y1 = d3.scale.ordinal()
				.rangeRoundBands([0, height], .2);

			var xAxis1 = d3.svg.axis()
				.scale(x1)
				.orient("top")
				.tickFormat(function(d) { return d + "%"; });

			var svg1 = d3.select("#synergy-div").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			svg1.append("text")
			.text(title2)
			.attr("class", "graph-title")
			.attr("fill", "#DDDDDD")
			.attr("y", "-40px")
			.attr("x", "80px");

			x1.domain([40,60])
			y1.domain(synergies.map(function (d) {
				return d.name;
			}));

			var synergygroup = svg1.append("g")
		        .selectAll("g")
		        .data(synergies)
		        .enter()
		        .append("g")
		        .attr("transform", function(d, i) { return "translate(0, " + y1(d.name) +")"; });

			synergygroup.append("rect")
				.attr("fill", function(d, i){
					if (d['value'] < 50) {
						return "#EE2C2C"
					}
					else return "#9CCB19"
				})
				.attr("class", "bar")
				.attr("x", function (d) {
					if (x1(d.value) - x1(50) < 0) {
						return (x1(Math.min(0, d.value)) + (x1(d.value) - x1(50)));
					}
					else {
						return x1(Math.min(0, d.value));
					}
				})
				.attr("width", function (d) {
					return Math.abs(x1(d.value) - x1(50));
				})
				.attr("height", y1.rangeBand())
				.attr("transform", "translate(" + width/0.4 + ", 0)");

			synergygroup.append("text")
			   .text(function(d) {
					var text = d.name + ", " + d.value + "%";
					return text;
			   })
			   .attr("x", function(d, i) {
			   		var num = parseFloat(d['value'])
					if (num < 50) {
						return x(Math.min(0, d['value'])) + 12;
					}
					else {
						return x(Math.min(0, d['value'])) - 12;
					}
			   })
			   .attr("text-anchor", function(d,i){
					var num = parseFloat(d['value'])
					if (num < 50) {
						return "start";
					}
					else {
						return "end";
					}
			   })
			   .attr("transform", "translate(" + width/0.4 + "," + 25 + ")")
			   .attr("fill", "white");

			svg1.append("g")
				.attr("class", "x axis")
				.call(xAxis1);

			svg1.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + width/0.4 + ", 0)")
				.append("line")
				.attr("x1", x1(0))
				.attr("x2", x1(0))
				.attr("y2", height);

			var toggle1 = svg1.append("g")
				.attr("class", "toggle")
				.attr("x", -2)
    			.attr("y", -46);

			toggle1.append("text")
		    	.attr("y", -46)
		    	.attr("class", "toggle")
		        .style("fill", "white")
		        .style("font-family", "Source Sans Pro")
		        .text("A-Z / Percent");

			toggle1.append("rect")
				.attr("width", 80)
		        .attr("height", 30)
		        .attr("x", -10)
		        .attr("y", -65)
		        .style("fill", "none")
		        .style("stroke", "white");

		    toggle1.on("click", stransition);

		    function mtransition() {
				if (m_a_to_z == 0) {
					matchups.sort(function(a, b) {return d3.descending(a["value"], b["value"]);});
					y.domain(matchups.map(function (d) {
						return d.name;
					}));
					m_a_to_z = 1;
				}
				else if (m_a_to_z == 1) {
					matchups.sort(function(a, b) {return d3.ascending(a["name"], b["name"]);});
					y.domain(matchups.map(function (d) {
						return d.name;
					}));
					m_a_to_z = 0
				}

				matchupgroup
		          .transition()
		          .duration(750)
		          .delay(function(d, i) { return i * 50; })
		          .attr("transform", function(d, i) { 
		            return "translate(0," + y(d.name) + ")";
		        });
			}

			function stransition() {
	      		if (s_a_to_z == 0) {
					synergies.sort(function(a, b) {return d3.descending(a["value"], b["value"]);});
					y.domain(synergies.map(function (d) {
						return d.name;
					}));
					s_a_to_z = 1;
				}
				else if (s_a_to_z == 1) {
					synergies.sort(function(a, b) {return d3.ascending(a["name"], b["name"]);});
					y.domain(synergies.map(function (d) {
						return d.name;
					}));
					s_a_to_z = 0
				}

				synergygroup
		          .transition()
		          .duration(750)
		          .delay(function(d, i) { return i * 50; })
		          .attr("transform", function(d, i) { 
		            return "translate(0," + y(d.name) + ")";
		        });
			}
		});
	}
})();
