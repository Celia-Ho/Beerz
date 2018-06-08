// This is our API key for Beer Mapping API
var APIKey = "afdeac53a3e38ffb25babbaa862d1de7";
// This is our API key for Google Places API
var GP_APIKey = "AIzaSyB0ePYPVkFl-ctOfTgJSJHbi7dLFCUBuAw";



// Geolocation
navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position.coords.latitude, position.coords.longitude);
});

function searchBeerInTown(location) {

    // Here we are building the URL we need to query the database
    // Querying the beer mapping API for the selected location
    var queryURL = `http://beermapping.com/webservice/loccity/${APIKey}/${location}&s=json`;
    
    // Querying the Google Places API with Nearby Search Request based on Geolocation coordinates obtained
    var queryURL2 = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=position.coords.latitude,position.coords.longitude&radius=50000&keyword=brewery&key=GP_APIKey';

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        // Printing the entire object to console
        for (var i = 0; i < response.length; i++) {
            console.log(response[i]);

            // Constructing HTML containing the brewery information
            var beerName = $("<h1>").html("Name: " + response[i].name);
            var beerURL = $("<a>").attr({
                "href": "https://" + response[i].url,
                "target": "_blank"
            }).append(beerName);
            var beerStreet = $("<h2>").text("Address: " + response[i].street);
            var beerStatus = $("<h2>").text("Status: " + response[i].status);

            // Append the new location content
            $("#location-div").append(beerURL, beerStreet, beerStatus);

        }
    });
}

// Event handler for user clicking the select-location button
$("#select-location").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    // Storing the location name
    var inputLocation = $("#location-input").val().trim();

    // Running the searchBeerInTown function (passing in the location as an argument)
    searchBeerInTown(inputLocation);
});
