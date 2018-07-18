var markers = [];
var filteredIDs = [1, 2, 3, 4, 5, 6, 7];
var infoWindow;
var trafficLayer;

/* Setting a list of each intended highlighted place,
with their respective latlong coordinates and foursquare venue ID
*/
var places = [
    { id: 01, title: 'Café com Gato', location:{ lat: -22.886995, lng: -47.071249 }, foursquare: '592610359ad60e7fa4077243' },
    { id: 02, title: 'Churrascaria Sorriso', location:{ lat: -22.885391, lng: -47.071415 }, foursquare: '4c56d9976201e21e5bb9ca6d' },
    { id: 03, title: 'Feirinha de Sábado', location:{ lat: -22.888954, lng: -47.072984 }, foursquare: '4e05e4062271dfa46ba5056d' },
    { id: 04, title: 'Nico Paneteria', location:{ lat: -22.889534, lng: -47.076583 }, foursquare: '4b47af24f964a520813a26e3' },
    { id: 05, title: 'Serata Pizza Bar', location:{ lat: -22.889959, lng: -47.078112 }, foursquare: '4eac7e5fd3e32ee0ddf7c4c6' },
    { id: 06, title: 'Oba Hortifruti', location:{ lat: -22.885835, lng: -47.060677 }, foursquare: '4c195597fe5a76b048740315' },
    { id: 07, title: 'Maialini', location:{ lat: -22.896420, lng: -47.054062 }, foursquare: '550ae74c498ee9f23e3e48fa' },
];

function initMap() {
    map = new google.maps.Map($('#map')[0], {
        center: {lat: -22.888508, lng: -47.066262},
        zoom: 15,
        /* The property below allows the map to be fully
        controlled with a mouse, without the need
        for keyboard controls.
        This means no "ctrl+scroll" for zoom in desktop mode,
        and no "use two fingers to move around" in mobile.
        */
        gestureHandling: 'greedy',
        /* 'mapTypeControl' dictates whether or not the user
        should have available the buttons for Sattelite, Map,
        and full-screen.
        Opting for 'false' makes the map a bit cleaner.
        */
        mapTypeControl: false,
        /* Disabling the default UI also helps to clean up
        the map.
        */
        disableDefaultUI: true,
    });

    infoWindow = new google.maps.InfoWindow();
    trafficLayer = new google.maps.TrafficLayer();
    viewModel.createMarkers(viewModel.filteredPlaces(), infoWindow);
}

var Place = function(loc) {
    this.id = ko.observable(loc.id);
    this.title = ko.observable(loc.title);
    this.location = ko.observable(loc.location);
    this.foursquare = ko.observable(loc.foursquare);
};

var ViewModel = function() {
    var self = this;

    // This observable gets the text in the search bar
    this.filterText = ko.observable('');
    this.placeList = ko.observableArray([]);

    // This makes the filter case-insensitive
    this.filteredTextLowercase = ko.computed( function() {
        var search = self.filterText().toLowerCase();
        return search;
    });

    /* We make a list to store and return the points of interest
    we created
    */
    places.forEach(function(place){
        self.placeList.push(new Place(place));
    });

    /* This function filters and returns a list of filtered items.
    If there is no text on the search bar, it returns the entire
    original list. */
    this.filteredPlaces = ko.computed( function() {
        var find = self.filteredTextLowercase();
        if (find == ''){
            return self.placeList();
        } else {
            return ko.utils.arrayFilter(self.placeList(), function (placeToCheck) {
                return (placeToCheck.title().toLowerCase().indexOf(find) >= 0);
            });
        }
    });

    /* This function initializes the markers on the map, and
    saves them to the 'markers' list.
    */
    this.createMarkers = function(locations, infoWindow) {
        for(var i = 0 ; i < locations.length ; i++) {
            var position = locations[i].location();
            var title = locations[i].title();
            var id = locations[i].id();
            var foursquare = locations[i].foursquare();
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                id: id,
                foursquare: foursquare
            });
            markers.push(marker);
            marker.addListener('click', function(){
                self.showInfoWindow(this, infoWindow);
                marker.setAnimation(null);
            });
        }
        for(var i = 0 ; i < markers.length ; i++) {
                markers[i].setMap(map);
        }
    }

    /* This function updates an ID array, used to keep
    track of the IDs of the markers that are supposed to
    be displayed.
    */
    this.updateMarkersIDsList = function() {
        filteredIDs.length = 0;
        for(var i = 0 ; i < self.filteredPlaces().length ; i++) {
            filteredIDs.push(self.filteredPlaces()[i].id());
        }
    }

    /* This function uses the array of markers IDs that
    are supposed to be displayed to filter their visibility.
    If a marker doesn't have its ID on the list, it is
    set to not be visible.
    */
    this.filterMarkers = function() {
        for(var i = 0 ; i < markers.length ; i++) {
            if ( filteredIDs.includes(markers[i].id) ) {
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }
    }

    /* Function for getting info from the Foursquare API.
    Currently the info obtained is category and rating. The title is obtained
    from the static list added on the beggining of the code.
    */
    this.foursquareInfo = function(foursquareID) {
        var foursquareInfo = [];
        const foursquareClientID = "TZXDJDHLGO0R3BZBTFJXDSCD33OZ0DW2BFAQMVJD13GLNT53"
        const foursquareSecret = "0Y1VJKQYUX5ZCM0XD4NUJLMFNOZDAFE3RERGOK2ZRK4SZETZ"
        var foursquareURL = "https://api.foursquare.com/v2/venues/"
                         + foursquareID
                         + "?client_id="
                         + foursquareClientID
                         + "&client_secret="
                         + foursquareSecret
                         + "&v=20180323&intent=browse";                  

        $.getJSON(foursquareURL, function(data) {
            $.each( data, function( key, val ) {
                if(key == 'response'){
                    var fourSquareHtml = '<p><strong>';
                    fourSquareHtml += (val['venue']['categories'][0]['name']) ? val['venue']['categories'][0]['name'] +' | ' : '';
                    fourSquareHtml += (val['venue']['rating']) ? 'Rating: ' + val['venue']['rating'] : '';
                    fourSquareHtml += '</strong><br><a href="' + val['venue']['canonicalUrl'] + '" target="_blank">Foursquare Link</a></p>'
                    $('#foursquare-text').html(fourSquareHtml);
                }
            });
        }).fail(function( jqxhr, textStatus, error ) {
            $('#foursquare-text').html('<p>Information from Foursquare<br>could not be loaded!</p>');
        });
    }

    /* This function ehxibits the window containing the information
    of the point of interest clicked.
    */
    this.showInfoWindow = function(marker, infowindow) {
        /* If the marker clicked is the same one, nothing
        changes. This avoid strain on the page.
        */
        if(infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('');
            infowindow.marker = marker;
            infowindow.addListener('closeclick', function(){
                infowindow.marker = null;
            });

            infowindow.setContent(
                '<div id="infowindow"><h5>' 
                + marker.title
                + '</h5></div><div id="foursquare-text"></div>'
            );

            self.foursquareInfo(marker.foursquare);
            infowindow.open(map, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            /* This makes sure the marker bounces only once.
            Since google's 'bounce' animation is roughly 700ms,
            this ensures that it doesn't begin a new one. Two bounces
            felt a bit long.
            Also, using 'setAnimation(null)' ensures that the animation
            isn't abruptly cut, but correctly finished.
            */
            setTimeout(function () {
                marker.setAnimation(null);
            }, 690);
        }
    }

    // Helper function to return the index of the marker
    this.getMarkerIndex = function(place) {
        var index = markers.map(function(o) { return o.id; }).indexOf(place.id());
        return index;
    }

    /* Using the marker index, the list correlates a list item
    to its correct map marker. 
    */
    this.showInfoWindowSidenav = function(place) {
        viewModel.showInfoWindow(markers[viewModel.getMarkerIndex(place)],infoWindow);
        $("#sidenav-overlay").trigger("click");
    }

    /*This initializes the sideNav, in accordance to the
    Materialize framework*/
    $('.button-collapse').sideNav({
        edge: 'left',
    });

    $('.collapsible').collapsible();
}

/* This function handles toggling the
traffic layer for the map. */
$(".traffic-button").click(function(){
    if(trafficLayer.getMap() == null){
        trafficLayer.setMap(map);
    } else {
        trafficLayer.setMap(null);             
    }
});

/* This function calls the update for the
marker ID array and the filterMarkers function
everytime there is a new character on the search
bar.
*/
$('.filter-options#filter').keyup(function(e){
    viewModel.updateMarkersIDsList();
    viewModel.filterMarkers();
});

/* Should the map not load, this function
takes care of hiding what it should and showing
an error message. */
function mapError() {
    $('.button-collapse').hide();
    $('.marker-title').hide();
    $('#filter').hide();
    $('.traffic-button').hide();
    $('#errorModal').css('display','block');
    $('#errorModal').css('padding-left','0');
}

var viewModel = new ViewModel();
ko.applyBindings(viewModel);
