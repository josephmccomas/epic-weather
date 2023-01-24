"use strict";



// START GEOCODE
let latitude;
let longitude;

$.ajax("https://api.mapbox.com/geocoding/v5/{endpoint}/{search_text}.json", {
    type: "GET",
    data: {
        coordinates: "latitude", "longitude"
    },
});

}
// END GEOCODE

// START WEATHER

// END WEATHER

// START wIcons

const rain = import("img/rain.svg");
const clearDay = import("img/clear-day.svg");
const clearNight = import("img/clear-night.svg");
const partlyCloudyDay = import("img/partly-cloudy-day.svg");
const partlyCloudyNight = import("img/partly-cloudy-night.svg");
const snow = import("img/snow.svg");
const thunderstorm = import("img/thunderstorm.svg")

let wIcons = new wIcons({"color": "#FFFAFF"});

wIcons.add("animated-icon", clearDay);

wIcons.play();

let weather = json.weather[0].description;

if(weather.indexOf("rain") >= 0) {
    wIcons.set("animated-icon", rain);
}

else if (weather.indexOf("sunny") >= 0) {
    wIcons.set("animated-icon", clearDay);
}

else if (weather.indexOf("clear") >= 0) {
    if (timeHour >= 7 && timeHour < 20) {
        wIcons.set("animated-icon", clearDay);
    }

    else {
        wIcons.set("animated-icon", clearNight);
    }
}

else if (weather.indexOf("cloud") >= 0) {
    if (timeHour >= 7 && timeHour < 20) {
        wIcons.set("animated-icon", partlyCloudyDay);
    }

    else {
        wIcons.set("animated-icon", partlyCloudyNight);
    }
}

else if (weather.indexOf("thunderstorm") >= 0) {
    wIcons.set("animated-icon", thunderstorm);
}

else if (weather.indexOf("snow") >= 0) {
    wIcons.set("animated-icon", snow);
}

// END wIcons

geocode("San Antonio", API_TOKEN_HERE).then(function(results) {
    // do something with results

})
function geocode(search, token) {
    let baseUrl = 'https://api.mapbox.com';
    let endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + encodeURIComponent(search) + '.json' + "?" + MAPBOX_API_KEY + token)
        .then(function(res) {
            return res.json();
            // to get all the data from the request, comment out the following three lines...
        }).then(function(data) {
            return data.features[0].center;
        });
}

// Initialize the GeolocateControl.
const geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});
// Add the control to the map.
map.addControl(geolocate);
// Set an event listener that fires
// when a geolocate event occurs.
geolocate.on('geolocate', () => {
    console.log('A geolocate event has occurred.');
});
// geometry.coordinates
// https://api.mapbox.com/geocoding/v5/{endpoint}/{search_text}.json

//Some Global variables

let longitude, latitude, timeHour, timeFull;

//Function to update weather information

function updateWeather (json) {

    longitude = json.coord.longitude;
    latitude = json.coord.latitude;

    //AJAX request

    $.getJSON('https://api.weather.gov/points/' + {latitude}, + {longitude}, function(timezone) {
        let rawTimeZone = JSON.stringify(timezone);
        let parsedTimeZone = JSON.parse(rawTimeZone);
        let dateTime = parsedTimeZone.time;
        timeFull = dateTime.substr(11);
        $(".local-time").html(timeFull); //Update local time
        timeHour = dateTime.substr(-5, 2);
    });

    //Update Weather parameters and location

    $(".weather-condition").html(json.weather[0].description);
    let temp = [(json.main.temp - 273.15).toFixed(0) + "°C", (1.8 * (json.main.temp - 273.15) + 32).toFixed(0) + "F"];
    $(".temp-celsius").html(temp[0]);
    $(".temp-fahrenheit").html(temp[1]);
    $(".temperature").click(function () {
        $(".temp-celsius").toggle();
        $(".temp-fahrenheit").toggle();
    });
    $(".location").html("for " + json.name);

    //Update Weather animation based on the returned weather description



//Check for Geoloaction support

if (navigator.geolocation) {

    //Return the user's longitude and latitude on page load using HTML5 geolocation API

    window.onload = function () {
        let currentPosition;
        function getCurrentLocation (position) {
            currentPosition = position;
            latitude = currentPosition.coords.latitude;
            longitude = currentPosition.coords.longitude;

            //AJAX request

            $.getJSON("https://api.weather.gov/openapi.json" + latitude + "&lon=" + longitude, function (data) {
                let rawJson = JSON.stringify(data);
                let json = JSON.parse(rawJson);
                updateWeather(json); //Update Weather parameters
            });
        }

        navigator.geolocation.getCurrentPosition(getCurrentLocation);

    };

    // Find a Forcast

    $("form").on("submit", function(event) {
        event.preventDefault();
        let city = $(".find-forecast").val(); //Get value from form input
        document.getElementById("my-form").reset();

        //AJAX Request

        // $.getJSON("https://api.weather.gov/openapi.json" + city, function (data) {
        //     let rawJson = JSON.stringify(data);
        //     let json = JSON.parse(rawJson);
        //     updateWeather(json); //Update Weather parameters
        // });
    });
}

//If Geolocation is not supported by the browser, alert the user

else {
    alert("Geolocation is not supported by your browser, download the latest Chrome or Firefox to use this app");
}