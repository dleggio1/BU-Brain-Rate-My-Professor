// get table
var table = document.getElementsByClassName('datadisplaytable')[0];

for (var i = 2; i < table.rows.length - 1; i++){
	
	// parse professor's name
	var prof = table.rows[i].cells[16].innerHTML;

	// clean professor's name
	var clean = prof.slice(0, prof.indexOf(" (")); // remove excess HTML
	var temp = clean.split(" "); // clear middle initial so we can search Rate My Professor	
	var firstName = temp[0]; // grab first name
	var lastName = temp[temp.length-1]; // grab last name

	var link = "http://www.ratemyprofessors.com/search.jsp?queryBy=teacherName&schoolName=binghamton+university+suny&queryoption=HEADER&query=" + firstName + "+" + lastName + "&facetSearch=true";
	
	// send message to event page
	getProfUrl(link, i)
}

// Searches for professor on Rate My Professor
function getProfUrl(link, index){
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: link,
		data: ""
	}, function (response) {
		var div = document.createElement('div');
		div.innerHTML = response;
		profurl = div.getElementsByClassName('listing PROFESSOR')[0].children[0].href;
		profurl = profurl.slice(profurl.indexOf("/ShowRatings"), profurl.length);
		profurl = "http://www.ratemyprofessors.com" + profurl;
		getRating(profurl, index);
	});
}

// Gets professor rating
function getRating(profurl, index){
	chrome.runtime.sendMessage({
		method: 'POST',
		action: 'xhttp',
		url: profurl,
		data: ""
	}, function (response) {
		var div = document.createElement('div');
		div.innerHTML = response;
		var rating;
		if(!isNaN(div.getElementsByClassName('grade')[0].innerHTML))
		{
			rating  = div.getElementsByClassName('grade')[0].innerHTML;
		}
		else{
			rating = "N/A";
		}
		
		injectRating(profurl,rating, index);
	});
}


// Injects rating into table
function injectRating(profurl,rating, index){
	var table = document.getElementsByClassName('datadisplaytable')[0];
	table.rows[index].cells[16].innerHTML = table.rows[index].cells[16].innerHTML + " - " + "<a href='" + profurl  + "' target='_blank'>" + rating  + "</a>";
}
