$(document).ready(function(){
// Main code goes here
var person1 = {}; // Object to store person 1 info
var person2 = {}; // Object to store person 2 info

// Enable date picker from materialize on the page
$('.datepicker').datepicker({
    format: 'dd/mm/yyyy',
    defaultDate: new Date(1990,06,06),
    minDate: new Date(1900,1,1),
    yearRange: 20
});

// Enable modal from materialize on the page
$('.modal').modal();

initialize(); // reset varaibles, hide elements, initialize web page first look

// Event listener to detect click from enter key and execute code
$(window).on("keypress", function(event) {
    if (event.which === 13) {
      event.preventDefault();
      initialize();
      checkInputFields();      
    };
  });

// Event listener to detect click from find button and execute code
$('#find-btn').on('click', function(){
    initialize();
    checkInputFields();
});

// Event listener to detect history button and display list
$('#historyBtn').on('click', function(){
    loadMatchHistory();
});

// Event listener to detect clear history button click and clear local storage
$('#clear-history').on('click', function(){
    localStorage.clear();
});

// Function to initialize first view of page and default variables
function initialize(){
    $('.fact-card').removeClass('scale-in'); // hide info cards
    $('.info').removeClass('scale-in'); // hide match info
    $('.gif').removeClass('scale-in'); // hide giphy image
    $('#info-text').addClass('scale-in'); // Dislpay App info text
    // Clear person1
    person1 = { 
        name: '',
        dob: '',
        funFacts: [],
        matchInfo: '',
        matchPercentage: ''
    };
    // Clear person2
    person2 = { 
        name: '',
        dob: '',
        funFacts: [],
        matchPercentage: ''
    }
}

// function to check if any input field is empty if not then execute code
function checkInputFields(){
    if (getInputFieldsInfo()){
        fetchMatchApi(person1, person2);
        fetchNumbersApi(person1, person2);
    };
};

// Function to get input fields info and assign info to person1 and person2 properties
function getInputFieldsInfo(){
    if ($('#name1').val() && $('#name2').val() && $('#dob1').val() && $('#dob2').val()){
    person1.name = $('#name1').val();
    person2.name = $('#name2').val();
    person1.dob = $('#dob1').val();
    person2.dob = $('#dob2').val();
    $('#form')[0].reset();
    return true
    } else {
        // assign invalid class to get error messages of form displayed
        $('.validate').addClass('invalid')
        return false
    }
};

// function to fetch info from Match API Love Calculator
function fetchMatchApi(person1, person2){
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://love-calculator.p.rapidapi.com/getPercentage?fname=${person1.name}&sname=${person2.name}`,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "fcac5b61c1msh4ebb16d3bfa8330p11196fjsn97e7bb56efb3",
            "x-rapidapi-host": "love-calculator.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        person1.matchPercentage = person2.matchPercentage = response.percentage;
        person1.matchInfo = person2.matchInfo = response.result;
        displayMatchInfo(person1);  // Display recieved match info on page
        getGif(response.percentage); // Fetch gif image and display
        saveMatchHistory(person1, person2); // Save matched couple to history in local storage
    });
};

// function to fetch info from Numbers API
function fetchNumbersApi(person1, person2){
    // Extract day, month and year from date string
    person1.day = person1.dob.slice(0, 2);
    person1.month = person1.dob.slice(3, 5);
    person1.year = person1.dob.slice(6);
    person2.day = person2.dob.slice(0, 2);
    person2.month = person2.dob.slice(3, 5);
    person2.year = person2.dob.slice(6);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://numbersapi.p.rapidapi.com/${person1.month + '/' + person1.day}/date?json=true`,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "fcac5b61c1msh4ebb16d3bfa8330p11196fjsn97e7bb56efb3",
            "x-rapidapi-host": "numbersapi.p.rapidapi.com"
        }
    };

    // Get facts for person1 based on their day/month date
    apiCall1 = $.get(settings).done(function (response) {
        person1.funFacts.push(response.text);
    });
    
    // Get facts for person2 based on their day/month date
    settings.url = `https://numbersapi.p.rapidapi.com/${person2.month + '/' + person2.day}/date?json=true`;
    apiCall2 = $.get(settings).done(function (response) {
        person2.funFacts.push(response.text);
    });

    // Get facts for person1 & 2 based on their year date
    settings.url = `https://numbersapi.p.rapidapi.com/${person1.year + ',' + person2.year}/year?json=true`;
    apiCall3 = $.get(settings).done(function (response) {
        var factArr = JSON.parse(response);
        person1.funFacts.push(factArr[person1.year]);
        person2.funFacts.push(factArr[person2.year]);
    });

    // Get math facts for person1 based on day number and month number
    settings.url = `https://numbersapi.p.rapidapi.com/${person1.day + ',' + person1.month}/math`;
    apiCall4 = $.get(settings).done(function (response) {
        $.each(JSON.parse(response), function(key, fact){
            person1.funFacts.push(fact);
        });
    });

    // Get math facts for person2 based on day number and month number
    settings.url = `https://numbersapi.p.rapidapi.com/${person2.day + ',' + person2.month}/math`;
    apiCall5 = $.get(settings).done(function (response) {
        $.each(JSON.parse(response), function(key, fact){
            person2.funFacts.push(fact);
        });
    });

    // Get trivia facts for person1 based on day number and month number
    settings.url = `https://numbersapi.p.rapidapi.com/${person1.day + ',' + person1.month}/trivia`;
    apiCall6 = $.get(settings).done(function (response) {
        $.each(JSON.parse(response), function(key, fact){
            person1.funFacts.push(fact);
        });
    });

    // Get trivia facts for person2 based on day number and month number
    settings.url = `https://numbersapi.p.rapidapi.com/${person2.day + ',' + person2.month}/trivia`;
    apiCall7 = $.get(settings).done(function (response) {
        $.each(JSON.parse(response), function(key, fact){
            person2.funFacts.push(fact);
        });
    });

    // when response data recieved from all requests call display info functions
    $.when(apiCall1, apiCall2, apiCall3, apiCall4, apiCall5, apiCall6, apiCall7).done(function(){
        displayNumbersInfo(person1, 1);
        displayNumbersInfo(person2, 2);
    });
};

// function to display match info from Love Calculator API
 function displayMatchInfo(person1){
    var $percentage = $('#showPercentage');
    var $match = $('#showMatchInfo');
    $match.text(person1.matchInfo);
    $percentage.text(person1.matchPercentage);
    $('.info').addClass('scale-in');
};

// Function to fetch funny gif from Giphy API based on percentage and display
function getGif(percentage){
    var matchNumber = parseInt(percentage);
    var keyWord = '';
    if (matchNumber < 15){
        keyWord = 'nope'
    } else if (matchNumber < 30){
        keyWord = 'disappointed'
    } else if (matchNumber < 50){
        keyWord = 'confused'
    } else if (matchNumber < 75){
        keyWord = 'goodluck'
    } else {
        keyWord = 'yes';
    } ;
    var endpoint = `https://api.giphy.com/v1/gifs/search?api_key=L2hcA8CaWClC3avIVwGtHdn9kVroSv2o&q=${keyWord}&limit=10&offset=0&lang=en`
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": endpoint,
    };
    $.get(endpoint, function (response) {
       var index = Math.floor(Math.random()*10); // get random index to choose gif out of 10 results
       $('#giphy').attr('src', response.data[index].images.original.url);
       $('.gif').addClass('scale-in'); // Animate scale-in using materialize to display gif
    });
};

// function to display match info from Love Calculator API
function displayNumbersInfo(person, cardNo){
    // first clear any old info from page
    $(`#p${cardNo}-facts`).empty();
    // remove App info-text from page
    $('#info-text').removeClass('scale-in');
    // create elelment with text to display on page
    $(`#person${cardNo}-title`).html('Date facts for ' + '<strong>' + person.name + '</strong>' + ' - ' + person.dob);
    for (var i = 0; i < person.funFacts.length; i++){
        var $fact = $('<li>');
        $fact.text(person.funFacts[i]);
        $(`#p${cardNo}-facts`).append($fact);
    }
    $('.fact-card').addClass('scale-in'); // animate card to appear - using materialize animation
};

// Function to save matched couples into loacal storage
function saveMatchHistory(person1, person2){
    var couplesArr = JSON.parse(localStorage.getItem('couples'));
    if (!couplesArr){
        couplesArr = []; // If there is no saved data in local storage create empty array
    }
    couplesArr.push([person1, person2]);
    localStorage.setItem('couples', JSON.stringify(couplesArr));
}

function loadMatchHistory(){
    $('#match-list').empty(); // Clear any old data from modal element
    var couplesArr = JSON.parse(localStorage.getItem('couples'));
    if (!couplesArr){
        couplesArr = [];
    }
    // Extract match info from saved couples and create strings list to display
    var list = couplesArr.map(function(element){
        var listString =element[0].matchPercentage + ' % - ' + element[0].name + ' & ' + element[1].name + ' - ' + element[0].matchInfo;
        return listString
    });
    // Sort list in ascending order based on %
    list.sort().reverse();
    $.each(list, function(index, value){
       var $matchList = $('<li class="collection-item">')
        $matchList.html(value);
    $('#match-list').append($matchList);    
    });
}

});
