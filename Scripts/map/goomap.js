//var map;
//function initMap() {
//    debugger;
//    map = new google.maps.Map(document.getElementById('map'), {
//        center: { lat: 19.304546, lng: - 99.203822 },
//        zoom: 13
//    });
//}

// [START maps_places_autocomplete_directions]
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        mapTypeControl: false,
        center: { lat: 19.308426, lng: -99.142671 },
        zoom: 16,
    });
    new AutocompleteDirectionsHandler(map);
}

//Marcado I
//window.onload = function () {
//    function initialize() {
//        var latlng = new google.maps.LatLng(19.308426, -99.142671);
//        var mapOptions = {
//            zoom: 16,
//            center: latlng,
//            mapTypeId: google.maps.MapTypeId.ROADMAP,
//        }
//        var map = new google.maps.Map(document.getElementById('map'),
//            mapOptions);
//        setMarkers(map, marcadores);
//    }
//    var marcadores = [
//        ['Rentalika coapa', 19.308426, -99.142671, 'Rentalika Coapa'],

//    ];
//    var infowindow;
//    function setMarkers(mapa, marcadores) {
//        for (var i = 0; i < marcadores.length; i++) {
//            var myLatLng = new google.maps.LatLng(marcadores[i][1],
//                marcadores[i][2]);
//            var marker = new google.maps.Marker({
//                position: myLatLng,
//                map: mapa,
//                title: marcadores[i][0],
//            });
//            (function (i, marker) {
//                google.maps.event.addListener(marker, 'click', function () {
//                    if (!infowindow) {
//                        infowindow = new google.maps.InfoWindow();
//                    }
//                    infowindow.setContent(marcadores[i][3]);
//                    infowindow.open(mapa, marker);
//                });
//            })(i, marker);
//        }
//    };
//    initialize();
//}
//Marcado F


class AutocompleteDirectionsHandler {
    map;
    originPlaceId;
    destinationPlaceId;
    travelMode;
    directionsService;
    directionsRenderer;
    constructor(map) {
        this.map = map;
        this.originPlaceId = "";
        this.destinationPlaceId = "";
        this.travelMode = google.maps.TravelMode.WALKING;
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer();
        this.directionsRenderer.setMap(map);
        const originInput = document.getElementById("origin-input");
        const destinationInput = document.getElementById("destination-input");
        const modeSelector = document.getElementById("mode-selector");
        const originAutocomplete = new google.maps.places.Autocomplete(originInput);
        // Specify just the place data fields that you need.
        originAutocomplete.setFields(["place_id"]);
        const destinationAutocomplete = new google.maps.places.Autocomplete(
            destinationInput
        );
        // Specify just the place data fields that you need.
        destinationAutocomplete.setFields(["place_id"]);
        this.setupClickListener(
            "changemode-walking",
            google.maps.TravelMode.WALKING
        );
        this.setupClickListener(
            "changemode-transit",
            google.maps.TravelMode.TRANSIT
        );
       
        this.setupClickListener(
            "changemode-driving",
            google.maps.TravelMode.DRIVING
        );
        this.setupPlaceChangedListener(originAutocomplete, "ORIG");
        this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
            destinationInput
        );
        this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
    }
    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    setupClickListener(id, mode) {
        const radioButton = document.getElementById(id);
        radioButton.addEventListener("click", () => {
            this.travelMode = mode;
            this.route();
        });
    }
    setupPlaceChangedListener(autocomplete, mode) {
        autocomplete.bindTo("bounds", this.map);
        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();

            if (!place.place_id) {
                window.alert("Please select an option from the dropdown list.");
                return;
            }

            if (mode === "ORIG") {
                this.originPlaceId = place.place_id;
            } else {
                this.destinationPlaceId = place.place_id;
            }
            this.route();
        });
    }
    route() {
        if (!this.originPlaceId || !this.destinationPlaceId) {
            return;
        }
        const me = this;
        this.directionsService.route(
            {
                origin: { placeId: this.originPlaceId },
                destination: { placeId: this.destinationPlaceId },
                travelMode: this.travelMode,
            },
            (response, status) => {
                if (status === "OK") {
                    me.directionsRenderer.setDirections(response);
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    }
}
// [END maps_places_autocomplete_directions]


(() => {
    "use strict";
    var e = {
        d: (t, o) => {
            for (var i in o)
                e.o(o, i) &&
                    !e.o(t, i) &&
                    Object.defineProperty(t, i, { enumerable: !0, get: o[i] });
        },
        o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
        r: (e) => {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module",
                }),
                Object.defineProperty(e, "__esModule", { value: !0 });
        },
    },
        t = {};
    function o() {
        const e = new google.maps.Map(document.getElementById("map"), {
            mapTypeControl: !1,
            center: { lat: 19.308426, lng: -99.142671 },
            zoom: 13,
        });
        new i(e);
    }
    e.r(t), e.d(t, { initMap: () => o });
    class i {
        map;
        originPlaceId;
        destinationPlaceId;
        travelMode;
        directionsService;
        directionsRenderer;
        constructor(e) {
            (this.map = e),
                (this.originPlaceId = ""),
                (this.destinationPlaceId = ""),
                (this.travelMode = google.maps.TravelMode.WALKING),
                (this.directionsService = new google.maps.DirectionsService()),
                (this.directionsRenderer = new google.maps.DirectionsRenderer()),
                this.directionsRenderer.setMap(e);
            const t = document.getElementById("origin-input"),
                o = document.getElementById("destination-input"),
                i = document.getElementById("mode-selector"),
                n = new google.maps.places.Autocomplete(t);
            n.setFields(["place_id"]);
            const s = new google.maps.places.Autocomplete(o);
            s.setFields(["place_id"]),
                this.setupClickListener(
                    "changemode-walking",
                    google.maps.TravelMode.WALKING
                ),
                this.setupClickListener(
                    "changemode-transit",
                    google.maps.TravelMode.TRANSIT
                ),
                this.setupClickListener(
                    "changemode-driving",
                    google.maps.TravelMode.DRIVING
                ),
                this.setupPlaceChangedListener(n, "ORIG"),
                this.setupPlaceChangedListener(s, "DEST"),
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(t),
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(o),
                this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(i);
        }
        setupClickListener(e, t) {
            document.getElementById(e).addEventListener("click", () => {
                (this.travelMode = t), this.route();
            });
        }
        setupPlaceChangedListener(e, t) {
            e.bindTo("bounds", this.map),
                e.addListener("place_changed", () => {
                    const o = e.getPlace();
                    o.place_id
                        ? ("ORIG" === t
                            ? (this.originPlaceId = o.place_id)
                            : (this.destinationPlaceId = o.place_id),
                            this.route())
                        : window.alert(
                            "Please select an option from the dropdown list."
                        );
                });
        }
        route() {
            if (!this.originPlaceId || !this.destinationPlaceId) return;
            const e = this;
            this.directionsService.route(
                {
                    origin: { placeId: this.originPlaceId },
                    destination: { placeId: this.destinationPlaceId },
                    travelMode: this.travelMode,
                },
                (t, o) => {
                    "OK" === o
                        ? e.directionsRenderer.setDirections(t)
                        : window.alert("Directions request failed due to " + o);
                }
            );
        }
    }
    var n = window;
    for (var s in t) n[s] = t[s];
    t.__esModule && Object.defineProperty(n, "__esModule", { value: !0 });
})();