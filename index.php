<!--
  League of Legends Viz Wiz
  CS171 Final Project, May 2014
  Authors: Shannon Zhu, Carl Gao, Jesse Chen
-->
<html>
	<head>
		<!--Include CSS and Font files-->
		<link rel="stylesheet" type="text/css" href="styles.css" media="screen" />
		<link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,600' rel='stylesheet' type='text/css'>

		<title>LoL VizWiz</title>
		<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
		<script src="http://d3js.org/topojson.v1.min.js"></script>
		<script type="text/javascript" src="jquery.js"></script>
	</head>

	<body>
		<div id="searchbar">
			<div id="toprow">
				<div id="tags">
					<div id="all" class="tag curr">ALL</div>
					<div id="top" class="tag">TOP</div>
					<div id="mid" class="tag">MID</div>
					<div id="bottom" class="tag">ADC</div>
					<div id="support" class="tag">SUPP</div>
					<div id="jungle" class="tag">JUNG</div>
				</div>
				<div id="searchtextcontainer">
					<div id="searchicon"><img id="mglass" src="searchicon.png"></div>
					<div id="searchtext">
						<textarea id="search" rows="1" cols="21"></textarea>
					</div>
					<div id="home"><img id="house" src="homeicon.png"></div>
				</div>
			</div>
			<div id="bottomrow">
				<div id="champcontainer"></div>
			</div>
		</div>
		<div id="searchbarholder"></div>
		<div id="content">
			<div id="nameblock">
				<div id="name"></div>
				<div id="title"></div>
			</div>

			<div id="wins"></div>

			<div class="linecharts">
				<div id="win-div" class="chart"></div>
				<div id="time-select-div" class="chart"></div>
			</div>
			<div class="linecharts">
				<div id="pick-div" class="chart"></div>
				<div id="ban-div" class="chart"></div>
			</div>

			<div id="barcharts">
				<div id="matchup-div" class="chart"></div>
				<div id="synergy-div" class="chart"></div>
			</div>
		</div>
		<div id="homepage">
			<div id="headline">League of Legends VizWiz</div>
			<div id="description">Check pick rates, ban rates, matchups and synergies on any of LoL's 118 champions.
			Featuring a dynamic searchbar, brushable and sortable visualizations, and constantly updating data, League of Legends VizWiz has everything you need to explore different champions' strengths or to pick a champion for a given lineup. <br /> <br />
			Select a champion above to get started.
			<br />
			--
			<br />
			Or peruse some of our overall statistics visualizations below:
			</div>
			<div id="chord-div">
				<div style="font-size:200%;">ADC-Support partnering popularity</div>
				<br />
				Supports &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ADCs
			</div>
			<div id="topheaders">
				<div id="t">Top 5 Win Rates</div>
				<div id="b">Bottom 5 Win Rates</div>
			</div>
			<div id="top10-div">
				<div id="toppic"></div>
				<div id="top5" class="fivechart"></div>
				<div id="bot5" class="fivechart"></div>
				<div id="botpic"></div>
			</div>
			<br />
			<br />
			<div id="summ">It's difficult to summarize everything all of our visualizations can show you, but some of the tidbits that stand out are:
			<ul>
				<li>Kayle, Warwick, and Fiora win at abnormally high rates.</li>
				<li>Caitlyn and Lucian are the most popular ADCs, while Thresh and Leona are the most popular supports.</li>
				<li>Even though Caitlyn and Thresh are the most popular of their respective roles and are very often played together, each is actually not even in the other's top 5 best partners.</li>
				<li>Before the most recent patch, Kassadin was so overpowered that he was banned in 91% of games, but now he's no longer a threat.</li>
			</ul>
			<div id="acknowledgements">We would like to thank LoLdb and LolKing for allowing us to use their data in the construction of this project. All art is copyright Riot Games.</div>
			<div id="data-link">Our data can be accessed <a href="/data">here</a>.</div>
</div>
		</div>

		<!--Include custom JavaScript files-->
		<script type="text/javascript" src="scripts.js"></script>
		<script type="text/javascript" src="champs.js"></script>
		<script type="text/javascript" src="time-select.js"></script>
		<script type="text/javascript" src="pick-ban-helpers.js"></script>
		<script type="text/javascript" src="bot-synergy-popularity.js"></script>
		<script type="text/javascript" src="win-viz.js"></script>
		<script type="text/javascript" src="pick-viz.js"></script>
		<script type="text/javascript" src="ban-viz.js"></script>
		<script type="text/javascript" src="matchups_and_synergies.js"></script>
		<script type="text/javascript" src="top-five.js"></script>
	</body>
</html>
