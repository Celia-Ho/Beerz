function initialize() {
    var goo = google.maps,
      map = new goo.Map(document.getElementById('map_canvas'), {
        zoom: 1,
        center: new goo.LatLng(0, 0),
        noClear: true
      }),
      input = map.getDiv().querySelector('input'),
      ac = new goo.places.SearchBox(input),
      service = new goo.places.PlacesService(map),
      win = new goo.InfoWindow,
      markers = [],
      request;


    map.controls[goo.ControlPosition.TOP_CENTER].push(input);

    if (input.value.match(/\S/)) {
      request = {
        query: input.value + ' breweries' || 'pub'
      };
      if (ac.getBounds()) {
        request.bounds = ac.getBounds();
      }
      service.textSearch(request, function(places) {
        //set the places-property of the SearchBox
        //places_changed will be triggered automatically
        ac.set('places', places || [])
      });
    }

    goo.event.addListener(ac, 'places_changed', function() {
      
      win.close();
      
      //remove previous markers
      while (markers.length) {
        markers.pop().setMap(null);
      }

      //add new markers 
      (function(places) {
        var bounds = new goo.LatLngBounds();
        for (var p = 0; p < places.length; ++p) {
          markers.push((function(place) {
            bounds.extend(place.geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
              }),
              content = document.createElement('div');
            content.appendChild(document.createElement('strong'));
            content.lastChild.appendChild(document.createTextNode(place.name));
            content.appendChild(document.createElement('div'));
            content.lastChild.appendChild(document.createTextNode(place.formatted_address));
            goo.event.addListener(marker, 'click', function() {
              win.setContent(content);
              win.open(map, this);
            });
            return marker;
          })(places[p]));
        };
        if (markers.length) {
          if (markers.length === 1) {
            map.setCenter(bounds.getCenter());
          } else {
            map.fitBounds(bounds);
          }
        }
      })(this.getPlaces());
    });
  }
  console.log(google.maps.event)
  google.maps.event.addDomListener(document.querySelector('.click-me'), 'click', initialize);