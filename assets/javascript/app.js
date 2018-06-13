// // This is our API key for Beer Mapping API
var APIKey = "afdeac53a3e38ffb25babbaa862d1de7";

// Geolocation
navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position.coords.latitude, position.coords.longitude);
});

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

    // Running Beer Mapping API ajax call
    
    // Here we are building the URL we need to query the database
    // Querying the beer mapping api for the selected location
    var queryURL = `http://beermapping.com/webservice/loccity/${APIKey}/${location}&s=json`
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        // Printing the entire object to console
        for (var i = 0; i < response.length; i++) {


            // Constructing HTML containing the brewery information           
            var beerName = $("<h5>").html(response[i].name);
            var beerURL = $("<a>").attr({
                "href": "https://" + response[i].url,
                "target": "_blank"
            }).append(beerName);
            var beerStreet = $("<h6>").text("Address: " + response[i].street);
            var beerStatus = $("<h6>").text("Type: " + response[i].status);

            // Append the new location content
            $("#location-div").append(beerURL, beerStreet, beerStatus);

            //concatenate api address deets for geocoder

            var barName = response[i].name
            var address = response[i].street;
            var city = response[i].city;
            var state = response[i].state;
            var country = response[i].country;
            var barUrl = response[i].url;

            var contentInfo = {
                streetAddress: address + ", " + city + ", " + state + ", " + country,
                name: barName,
                url: barUrl
            }
            barDetails.push(contentInfo);
          
        var handle = setInterval(function () {
            if (barDetails.length == 1){
                clearInterval(handle)
            }
            var contentMar = barDetails.pop()
            console.log(contentMar);        
            var streetAddresses = contentMar.streetAddress
            console.log(streetAddresses)
            geocoder.geocode({ 'address': streetAddresses }, function (results, status) {
                if (status === 'OK') {
                    var myLatLong = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
                    // console.log(myLatLong);
                    var marker = new google.maps.Marker({
                        map: resultsMap,
                        position: results[0].geometry.location,

                        title: contentMar.name,
                        // url: '<a href = https://' + contentMar.url + ' ' + 'target = "blank">'
                    });
                       

                    // google.maps.event.addListener(marker, 'click', function() {
                    //     window.location.href = marker.url
                    // });

                    var contentString = '<a href = https://' + contentMar.url + ' ' + 'target = "blank">' + contentMar.name +  '</a>';
                    var infowindow = new google.maps.InfoWindow({
                        content: contentString
                      });console.log(contentString);
                    
                      marker.addListener('click', function() {
                        infowindow.open(map, marker);
                      });
                    
     
                    resultsMap.panTo(myLatLong);
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                };
            });
        }, 700);

    });
}

// Event handler for user clicking the select-location button

$("#select-location").on("click", function (event) {
    // Preventing the button from trying to submit the form
    event.preventDefault();
    
    // Storing the location name
    var inputLocation = $("#location-input").val().trim();

    //clearMarkers();
    // markers = [];
    // Running the searchBeerInTown function (passing in the location as an argument)
    searchBeerInTown(inputLocation);
});
// Deletes all markers in the array by removing references to them.



// })   //doc ready close
 ela-p-p

