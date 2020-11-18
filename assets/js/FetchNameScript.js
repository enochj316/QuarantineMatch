
// function to fetch info from Name API
function fetchMatchApi(person1, person2){
    console.log();


	
	const settings = {
		"async": true,
		"crossDomain": true,
		"url": `https://love-calculator.p.rapidapi.com/getPercentage?fname=${person1.name + '&sname=' + person2.name}`,
		"method": "GET",
		"headers": {
			"x-rapidapi-key": "f60145376fmsh16be9a668b67c3ep14af4ejsn0b27bac5f4ea",
			"x-rapidapi-host": "love-calculator.p.rapidapi.com"
		}
	};
	
	$.ajax(settings).done(function (response) {
		console.log(response.result, response.percentage);
		$(".Results").append(response.percentage, response.result)
	});

	}

	fetchMatchApi({name:"Joyson"},{name:"Hansiga"})

