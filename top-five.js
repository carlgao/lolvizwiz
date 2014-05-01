
dataSource = 'data/win_rates.json'
d3.json(dataSource, function(error, json) {
		if (error) return console.warn(error);
		
		dataSet = json;
		newData = {};
		topFive = {"one": 0, "two": 0, "three": 0, "four": 0, "five": 0};
		botFive = {"one": 100, "two": 100, "three": 100, "four": 100, "five": 100};

		for (champion in dataSet) 
		{
			current = dataSet[champion].length - 1;
			winRate = dataSet[champion][current].percent;
			newData[champion] = winRate;
		}

		for (champion in newData)
		{
			// Top 5
			minKey = "";
			minValue = 100;
			for (each in topFive)
			{
				if (topFive[each] < minValue)
				{
					minValue = topFive[each];
					minKey = each;
				}
			}
			if (newData[champion] > minValue)
			{
				topFive[champion] = newData[champion];
				delete topFive[minKey];
			}
			// Bot 5
			maxKey = "";
			maxValue = 0;
			for (each in botFive)
			{
				if (botFive[each] > maxValue)
				{
					maxValue = botFive[each];
					maxKey = each;
				}
			}
			if (newData[champion] < maxValue)
			{
				botFive[champion] = newData[champion];
				delete botFive[maxKey];
			}
		}

		top5 = [];
		bot5 = [];
		newTopFive = {};
		newBotFive = {};
		for (each in topFive)
		{
			top5.push(topFive[each].toFixed(2));
			newTopFive[topFive[each].toFixed(2)] = each;
		}
		for (each in botFive)
		{
			bot5.push(botFive[each].toFixed(2));
			newBotFive[botFive[each].toFixed(2)] = each;
		}
		top5 = top5.sort().reverse();
		bot5 = bot5.sort();
		topNames = [];
		botNames = [];
		for (each in top5)
		{
			topNames.push(newTopFive[top5[each]]);
		}
		for (each in bot5)
		{
			botNames.push(newBotFive[bot5[each]]);
		}

		var x = d3.scale.linear()
		    .domain([0, d3.max(top5)])
		    .range([0, 220]);

		d3.select("#top5")
		  .selectAll("div")
		    .data(top5)
		  .enter().append("div")
		    .style("width", function(d) { return x(d*30) - 6250 + "px"; })
		    .style("height", "35px")
		    .text(function(d) { return newTopFive[d] + ", " + d + "%"; });


	    d3.select("#bot5")
	      .selectAll("div")
	        .data(bot5)
	      .enter().append("div")
	        .style("width", function(d) { return x(d*20) - 3400 + "px"; })
	        .style("height", "35px")
	        .text(function(d) { return newBotFive[d] + ", " + d + "%"; });

	    for (champ in topNames)
	    {
	    	var div = document.createElement('div');
	    	var img = document.createElement('img');
	    	for (var i = 0; i < CHAMPS.length; i++)
	    	{
	    		if (CHAMPS[i].name == topNames[champ])
	    		{
	    			img.setAttribute('src', CHAMPS[i].thumbnail);
	    			//console.log(img);
	    		}
	    	}
	    	$(img).hover(function() {
	    		$(this).css('opacity', '1');
	    	}, function() {
	    		$(this).css('opacity', '.88');
	    	});
	    	$('#toppic').append(div).append(img);
	    }

	    for (champ in botNames)
	    {
	    	var div = document.createElement('div');
	    	var img = document.createElement('img');
	    	for (var i = 0; i < CHAMPS.length; i++)
	    	{
	    		if (CHAMPS[i].name == botNames[champ])
	    		{
	    			img.setAttribute('src', CHAMPS[i].thumbnail);
	    		}
	    	}
	    	$(img).hover(function() {
	    		$(this).css('opacity', '1');
	    	}, function() {
	    		$(this).css('opacity', '.88');
	    	});
	    	$('#botpic').append(div).append(img);

	    }
	});
