var margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 10
},
width = 500 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var datatest = {
            'matchups': {
                'Urgot': 58.22,
                'Vayne': 53.28,
                'Trist': 52.04,
                'Ezreal': 51.63,
                'Varus': 51.27,
                'Miss Fortune': 50.92,
                'Jinx': 50.81,
                'Draven': 50.51,
                'Lucian': 50.27,
                'Ashe': 50.06,
            },
            'synergies': {
                'Teemo': 53.25,
                'Sona': 53.19,
                'Leona': 52.28,
                'Blitzcrank': 52.25,
                'Soraka': 51.99,
                'Sivir': 58.55,
                'Graves': 57.66,
                'Corki': 56.95,
                'Lucian': 56.19,
                'Miss Fortune': 56.17
            }
        }

var matchups = [];
var d = datatest['matchups'];
Object.keys(datatest['matchups']).forEach(function(key, i){
    var value = d[key]
    if (i >= 5) {
        value = 100 - d[key];
    }
    var obj = {name: key, value: value};
    matchups.push(obj);
});
matchups = matchups.slice(0,5).concat(matchups.slice(5, 10).reverse());

var synergies = [];
var e = datatest['synergies'];
Object.keys(datatest['synergies']).forEach(function(key, i){
    var value = e[key]
    if (i >= 5) {
        value = 100 - e[key];
    }
    var obj = {name: key, value: value};
    synergies.push(obj);
});
synergies = synergies.slice(0,5).concat(synergies.slice(5, 10).reverse());

var x = d3.scale.linear()
    .range([0, width])

var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .2);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top");

var svg = d3.select("#matchup-div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain([40,60])
y.domain(matchups.map(function (d) {
    return d.name;
}));

svg.selectAll(".bar")
    .data(matchups)
    .enter().append("rect")
    .attr("fill", function(d, i){
        if (i >= 5) {
            return "red"
        }
        else return "green"
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
    .attr("y", function (d) {
    return y(d.name);
})
    .attr("width", function (d) {
    return Math.abs(x(d.value) - x(50));
})
    .attr("height", y.rangeBand())
    .attr("transform", "translate(" + width/0.4 + ", 0)");

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

svg.selectAll(".text")
   .data(matchups)
   .enter()
   .append("text")
   .text(function(d) {
        var text = d.name + ", " + d.value;
        console.log(text);
        return text;
   })
   .attr("x", function(d, i) {
        if (i >= 5) {
            return x(Math.min(0, d.value)) + 5;
        }
        else {
            return x(Math.min(0, d.value)) - 5;
        }
   })
   .attr("y", function(d) {
        return y(d.name);
   })
   .attr("text-anchor", function(d,i){
        if (i >=5) {
            return "start";
        }
        else {
            return "end";
        }
   })
   .attr("transform", "translate(" + width/0.4 + "," + 25 + ")");

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
    .orient("top");

var svg1 = d3.select("#synergy-div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x1.domain([40,60])
y1.domain(synergies.map(function (d) {
    return d.name;
}));

svg1.selectAll(".bar")
    .data(synergies)
    .enter().append("rect")
    .attr("fill", function(d, i){
        if (i >= 5) {
            return "red"
        }
        else return "green"
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
    .attr("y", function (d) {
    return y1(d.name);
})
    .attr("width", function (d) {
    return Math.abs(x1(d.value) - x1(50));
})
    .attr("height", y1.rangeBand())
    .attr("transform", "translate(" + width/0.4 + ", 0)");

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

svg1.selectAll(".text")
   .data(synergies)
   .enter()
   .append("text")
   .text(function(d) {
        var text = d.name + ", " + d.value;
        console.log(text);
        return text;
   })
   .attr("x", function(d, i) {
        if (i >= 5) {
            return x(Math.min(0, d.value)) + 5;
        }
        else {
            return x(Math.min(0, d.value)) - 5;
        }
   })
   .attr("y", function(d) {
        return y1(d.name);
   })
   .attr("text-anchor", function(d,i){
        if (i >=5) {
            return "start";
        }
        else {
            return "end";
        }
   })
   .attr("transform", "translate(" + width/0.4 + "," + 25 + ")");
