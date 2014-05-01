/*
 * League of Legends Viz Wiz
 * CS171 Final Project, May 2014
 *
 * Authors: Shannon Zhu, Carl Gao, Jesse Chen
 *
*/

CONTENT = $('#content');
HOMEPAGE = $('#homepage');
TAG = "all";

$(document).ready(function() {
	var contents = "";
	$('#content').replaceWith(HOMEPAGE);
    drawSearch(CHAMPS, []);
    $('#search').keydown(function(e) {
		document.getElementById('champcontainer').scrollLeft = 0;
    	if (e.which == 13)
    	{
    		e.preventDefault();
    	}
    });
    $('#search').keyup(function(e) {
    	contents = "";
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
				showAll();
				var name = matchone[0].name;
				document.getElementById('name').innerHTML = name;
				document.getElementById('title').innerHTML = matchone[0].title;
				window.updateWinRateViz(name);
				window.updatePickRateViz(name);
				window.updateBanRateViz(name);
				window.updateSynergyAndMatchupViz(name);
				contents = "";
    		}
    	}
    }); 
	// 
	$('#home').on('click', function() {
		hideAll();
		$('#search').val("");
		var results = processArray("");
		drawSearch(results[0], results[1]);
	});

	$('.tag').on('click', function() {
		$('.curr').removeClass('curr');
		$(this).addClass('curr');
		TAG = $(this).attr('id');
		var results = processArray(contents);
		drawSearch(results[0], results[1]);
	});
});

// filter champ array to only keep what matches search query
var processArray = function(contents) {
	var filtered = [];
	var complement = [];
	for (var i = 0; i < CHAMPS.length; i++)
	{
		matchesTag = false;
		for (var role = 0; role < CHAMPS[i].roles.length; role++)
		{
			if (CHAMPS[i].roles[role] == TAG)
				matchesTag = true;
		}
		var curchamp = CHAMPS[i].id;
		curchamp = curchamp.substring(0, contents.length);
		if (contents == curchamp && (matchesTag || TAG == "all"))
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
					showAll();
					$('body').css({
						'background-image': 'url(' + escape(champArray[j].portrait) + ')',
					});
					var name = champArray[j].name;
					document.getElementById('name').innerHTML = name;
					document.getElementById('title').innerHTML = champArray[j].title;
					window.updateWinRateViz(name);
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
					showAll();
					$('body').css({
						'background-image': 'url(' + escape(complement[j].portrait) + ')',
					});
					var name = complement[j].name;
					document.getElementById('name').innerHTML = name;
					document.getElementById('title').innerHTML = complement[j].title;
					window.updateWinRateViz(name);
					window.updatePickRateViz(name);
					window.updateBanRateViz(name);
					window.updateSynergyAndMatchupViz(name);
				});
			})();
		}
		// assign css attributes
		$(img).css({
			'max-width': '100%',
			'max-height': '100%',
			'opacity': '.90'
		});
		$(img).hover(function() {
			$(this).css('opacity', '1');
		}, function() {
			$(this).css('opacity', '.90');
		});
		$(imgnail).css({
			width: '80px',
			height: '80px',
			margin: 'auto',
			'margin-top': '18px',
			'-webkit-border-radius': '6px',
			'-moz-border-radius': '6px',
			'border-radius': '6px', 
			cursor: 'pointer'
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
				window.updateWinRateViz(name);
				window.updatePickRateViz(name);
				window.updateBanRateViz(name);
				window.updateSynergyAndMatchupViz(name);
			});
		})();*/
	}
};

var hideAll = function () {
	//document.getElementById("content").style.visibility="hidden";
	$('#content').replaceWith(HOMEPAGE);
	$('body').css({
		'background-image': "",
	});
}

var showAll = function () {
	//document.getElementById("content").style.visibility="visible";
	$('#homepage').replaceWith(CONTENT);
}
