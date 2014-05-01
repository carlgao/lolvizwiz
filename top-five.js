
dataSource = 'data/win_rates.json'
d3.json(dataSource, function(error, json) {
		if (error) return console.warn(error);
		
		dataSet = json;
		newData = {};

		topFive = {};
		topCount = 0;
		topWorst = 100;
		topWorstId = "";

		botFive = {};
		botCount = 0;
		botBest = 0;
		botBestId = "";

		for (champion in dataSet) 
		{
			current = dataSet[champion].length - 1;
			winRate = dataSet[champion][current].percent / 100;
			newData[champion] = winRate;
			if (topCount < 5)
			{
				topFive[champion] = winRate;
				if (winRate < topWorst)
				{
					topWorst = winRate;
					topWorstId = champion;
				}
				topCount++;
			}
			else
			{
				if (winRate > topWorst)
				{
					delete topFive[topWorstId];
					topFive[champion] = winRate;
				}
			}
			if (botCount < 5)
			{
				botFive[champion] = winRate;
				if (winRate > botBest)
				{
					botBest = winRate;
					botBestId = champion;
				}
				botCount++;
			}
			else
			{
				if (winRate < botBest)
				{
					delete botFive[botBestId];
					botFive[champion] = winRate;
				}
			}
		}
		console.log(newData);
		console.log(topFive);
		console.log(botFive);
	});