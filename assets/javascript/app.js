// $(document).ready(function() {
// This is our API key
var APIKey = "afdeac53a3e38ffb25babbaa862d1de7";

// Geolocation
// navigator.geolocation.getCurrentPosition(function (position) {
//     console.log(position.coords.latitude, position.coords.longitude);
// });

var geocoder
var barDetails = []
var resultsMap
function initMap() {
    var myLatLong = new google.maps.LatLng(43.68, -79.4);
    resultsMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,
        center: myLatLong
    });
    geocoder = new google.maps.Geocoder();
}


function searchBeerInTown(location) {
    
    // Here we are building the URL we need to query the database
    // Querying the beer mapping api for the selected location
    var queryURL = `http://beermapping.com/webservice/loccity/${APIKey}/${location}&s=json`;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Printing the entire object to console
        for (var i = 0; i < response.length; i++) {
            console.log(response[i]);
            //concatenate api address deets for geocoder

            for (var c = 0; c < response.length; c++) {
                var name = response[c].name
                var address = response[c].street;
                var city = response[c].city;
                var state = response[c].state;
                var country = response[c].country;
                var url = "https://" + response[c].url
                var contentInfo = {
                    streetAddress: address + ", " + city + ", " + state + ", " + country,
                    name: name,
                    url:url
                }
                barDetails.push(contentInfo)
            }

            // Constructing HTML containing the brewery information
            var beerName = $("<h1>").html(response[i].name);
            var beerURL = $("<a>").attr({
                "href": "https://" + response[i].url,
                "target": "_blank"
            }).append(beerName);
            var beerStreet = $("<h2>").text("Address: " + response[i].street);
            var beerStatus = $("<h2>").text("Type: " + response[i].status);

            // Append the new location content
            $("#location-div").append(beerURL, beerStreet, beerStatus);

        }        
        // for (var j = 0; j < response.length; j++) {
        //     var name = response[j].name;
        //     var street = response[j].street;         
        //     var url = "https://" + response[j].url
        //     contentInfo = name + ", " + street + ", " + url;
        // }

        // var infoWindow = new google.maps.InfoWindow({
        //     content: contentInfo
        // });

        var handle = setInterval(function () {
            if (barDetails.length == 0){
                clearInterval(handle)
            }
            var contentInfo = barDetails.pop()
            var streetAddress = contentInfo.streetAddress
            geocoder.geocode({ 'address': streetAddress }, function (results, status) {
                if (status === 'OK') {
                    var myLatLong = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
                    // console.log(myLatLong);
                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location,
                        title : contentInfo.name,
                        url: contentInfo.url                                          
                    }); 
                    google.maps.event.addListener(marker, 'click', function() {
                        window.location.href = marker.url
                    });
                    resultsMap.panTo(myLatLong);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                };
            });
        }, 700); 
        
    });; 
}

// Event handler for user clicking the select-location button
// $("#select-location").on("click", function (event) {
// window.location.reload(true);
// event.stopPropagation();
// });

$("#select-location").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    
    // Storing the location name
    var inputLocation = $("#location-input").val().trim();

    
    // Running the searchBeerInTown function (passing in the location as an argument)
    searchBeerInTown(inputLocation);
});


// })   //doc ready close

