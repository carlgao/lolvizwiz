/*
 * League of Legends Viz Wiz
 * CS171 Final Project, May 2014
 *
 * Authors: Shannon Zhu, Carl Gao, Jesse Chen
 *
*/

$(document).ready(function() {
    drawSearch(CHAMPS, []);
    $('#search').keydown(function(e) {
		document.getElementById('champcontainer').scrollLeft = 0;
    	if (e.which == 13)
    	{
    		e.preventDefault();
    	}
    });
    $('#search').keyup(function(e) {
    	var contents = "";
    	if (e.which != 13)
    	{
    		contents = $('#search').val();
    		contents = contents.replace(/\./g, "");
    		contents = contents.replace(/ /g, "");
    		contents = contents.replace(/'/g, "");
    		contents = contents.toLowerCase();
    		var results = processArray(contents);
    		drawSearch(results[0], results[1]);
    	}
    	else // enter
    	{
    		contents = $('#search').val();
    		contents = contents.replace(/\./g, "");
    		contents = contents.replace(/ /g, "");
    		contents = contents.replace(/'/g, "");
    		contents = contents.toLowerCase();
    		var matchone = processArray(contents)[0];
    		if(matchone.length == 1)
    		{
				$('body').css({
					'background-image': 'url(' + escape(matchone[0].portrait) + ')',
				});
				var name = matchone[0].name;
				document.getElementById('name').innerHTML = name;
				document.getElementById('title').innerHTML = matchone[0].title;
				window.updatePickRateViz(name);
				window.updateBanRateViz(name);
				contents = "";
    		}
    	}
    }); 
});

// filter champ array to only keep what matches search query
var processArray = function(contents) {
	var filtered = [];
	var complement = [];
	for (var i = 0; i < CHAMPS.length; i++)
	{
		var curchamp = CHAMPS[i].id;
		curchamp = curchamp.substring(0, contents.length);
		if (contents == curchamp)
		{
			filtered.push(CHAMPS[i]);
		}
		else 
		{
			complement.push(CHAMPS[i]);
		}
	}
	var sets = [filtered, complement];
	return sets; 
};

// draw filtered champ array into search bar
var drawSearch = function(champArray, complement) {
	document.getElementById('champcontainer').innerHTML = "";
	for (var i = 0; i < champArray.length + complement.length; i++)
	{
		// create html elements in search bar
		var div = document.createElement('div');
		var imgnail = document.createElement('div');
		var img = document.createElement('img');
		var text = document.createElement('div');
		if (i < champArray.length)
		{
			text.innerHTML = champArray[i].name;
			img.setAttribute('src', champArray[i].thumbnail);
			(function() {
				var j = i;
				$(imgnail).on('click', function() {
					$('body').css({
						'background-image': 'url(' + escape(champArray[j].portrait) + ')',
					});
					var name = champArray[j].name;
					document.getElementById('name').innerHTML = name;
					document.getElementById('title').innerHTML = champArray[j].title;
					window.updatePickRateViz(name);
					window.updateBanRateViz(name);
					window.updateSynergyAndMatchupViz(name);
				});
			})();
		}
		else
		{
			var newi = i - champArray.length;
			text.innerHTML = complement[newi].name;
			img.setAttribute('src', complement[newi].thumbnail);
			$(div).css({
				opacity: 0.18
			});
			(function() {
				var j = newi;
				$(imgnail).on('click', function() {
					$('body').css({
						'background-image': 'url(' + escape(complement[j].portrait) + ')',
					});
					var name = complement[j].name;
					document.getElementById('name').innerHTML = name;
					document.getElementById('title').innerHTML = complement[j].title;
					window.updatePickRateViz(name);
					window.updateBanRateViz(name);
					window.updateSynergyAndMatchupViz(name);
				});
			})();
		}
		// assign css attributes
		$(img).css({
			'max-width': '100%',
			'max-height': '100%'
		});
		$(imgnail).css({
			width: '80px',
			height: '80px',
			margin: 'auto',
			'margin-top': '18px',
			'-webkit-border-radius': '6px',
			'-moz-border-radius': '6px',
			'border-radius': '6px'
		});
		$(text).css({
			width: '100%',
			height: '2px',
			position: 'inline',
			'text-align': 'center'
		});
		$(div).css({
   			'font-size': '12px',
   			width: '88px',
   			height: '100%',
   			display: 'inline-block'
		});
		// append to document
		$(imgnail).append(img);
		$(div).append(text);
		$(div).append(imgnail);
		$('#champcontainer').append(div);
		// onclick features
		/*(function() {
			var j = i;
			$(imgnail).on('click', function() {
				$('body').css({
					'background-image': 'url(' + escape(champArray[j].portrait) + ')',
					'background-repeat': 'no-repeat'
				});
				var name = champArray[j].name;
				document.getElementById('name').innerHTML = name;
				document.getElementById('title').innerHTML = champArray[j].title;
				window.updatePickRateViz(name);
				window.updateBanRateViz(name);
				window.updateSynergyAndMatchupViz(name);
			});
		})();*/
	}
};
