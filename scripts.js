/*
 * League of Legends Viz Wiz
 * CS171 Final Project, May 2014
 *
 * Authors: Shannon Zhu, Carl Gao, Jesse Chen
 *
*/


$(document).ready(function() {
    drawSearch(CHAMPS);
    $('#search').keyup(function(e) {
    	var contents = $('#search').val();
    	console.log(contents);
    	processArray(contents);
    	if (e.which == 13) // enter
    	{
    		// if contents matches one champ exactly, go to that page (NEED TO IMPLEMENT THIS)
    	}
    }); 
});

// filter champ array to only keep what matches search query
var processArray = function(contents) {
	var filtered = [];
	for (var i = 0; i < CHAMPS.length; i++)
	{
		var curchamp = CHAMPS[i].id;
		curchamp = curchamp.substring(0, contents.length);
		if (contents == curchamp)
		{
			filtered.push(CHAMPS[i]);
		}
	}
	drawSearch(filtered);
};

// draw filtered champ array into search bar
var drawSearch = function(champArray) {
	document.getElementById('champcontainer').innerHTML = "";
	for (var i = 0; i < champArray.length; i++)
	{
		// create html elements in search bar
		var div = document.createElement('div');
		var imgnail = document.createElement('div');
		var img = document.createElement('img');
		var text = document.createElement('div');
		text.innerHTML = champArray[i].name;
		img.setAttribute('src', champArray[i].thumbnail);
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
		(function() {
			var j = i;
			$(imgnail).on('click', function() {
				$('#content').css({
					'background-image': 'url(' + escape(champArray[j].portrait) + ')',
					'background-repeat': 'no-repeat'
				});
				$('#name').innerHTML = champArray[j].name;
				$('#title').innerHTML = champArray[j].title;
			});
		})();
	}
};

