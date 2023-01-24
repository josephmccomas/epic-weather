"use strict";

//wIcons

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

geocode("San Antonio", API_TOKEN_HERE).then(function(results) {
    // do something with results
})
function geocode(search, token) {
    let baseUrl = 'https://api.mapbox.com';
    let endPoint = '/geocoding/v5/mapbox.places/';
    return fetch(baseUrl + endPoint + encodeURIComponent(search) + '.json' + "?" + 'access_token=' + token)
        .then(function(res) {
            return res.json();
            // to get all the data from the request, comment out the following three lines...
        }).then(function(data) {
            return data.features[0].center;
        });
}

//Some Global variables

let longitude, latitude, timeHour, timeFull;

//Function to update weather information

function updateWeather (json) {

    longitude = json.coord.longitude;
    latitude = json.coord.latitude;

    //AJAX request

    $.getJSON('https://api.weather.gov/openapi.json' + latitude + '&lng=' + longitude, function(timezone) {
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
}

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




// /***
//  * geocode is a method to search for coordinates based on a physical address and return
//  * @param {string} search is the address to search for the geocoded coordinates
//  * @param {string} token is your API token for MapBox
//  * @returns {Promise} a promise containing the latitude and longitude as a two element array
//  *
//  * EXAMPLE:
//  *
//
//
// /***
//  * reverseGeocode is a method to search for a physical address based on inputted coordinates
//  * @param {object} coordinates is an object with properties "lat" and "lng" for latitude and longitude
//  * @param {string} token is your API token for MapBox
//  * @returns {Promise} a promise containing the string of the closest matching location to the coordinates provided
//  *
//  * EXAMPLE:
//  *
//  *  reverseGeocode({lat: 32.77, lng: -96.79}, API_TOKEN_HERE).then(function(results) {
//  *      // do something with results
//  *  })
//  *
//  */
// function reverseGeocode(coordinates, token) {
//     let baseUrl = 'https://api.mapbox.com';
//     let endPoint = '/geocoding/v5/mapbox.places/';
//     return fetch(baseUrl + endPoint + coordinates.lng + "," + coordinates.lat + '.json' + "?" + 'access_token=' + token)
//         .then(function(res) {
//             return res.json();
//         })
//         // to get all the data from the request, comment out the following three lines...
//         .then(function(data) {
//             return data.features[0].place_name;
//         });
// }