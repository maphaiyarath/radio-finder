$(document).ready(function() {
    // getting past CORS
    jQuery.ajaxPrefilter(function(options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });

    // $('.dropdown-trigger').dropdown();


    // global variables
    var callsign = '';
    var city = '';
    var state = '';
    var stations = [];
    var genres = [];

    // search button event handler
    $("#search-button").on("click", function(event) {
        event.preventDefault();

        // TODO: make sure the input is valid
        city = $("#city-input").val().trim();
        // state = ;

        if (!city) {
            return;
        }

        // if the input is valid, go to the results page and display the list of radio stations
        getStations();
        
        // TODO: otherwise, tell the user to search again
    });
    
    // return a list of radio stations using dar fm api
    function getStations() {
        // dar fm
        var apiKey = '4363387309';

        // for now, we are hard coding city & state
        city = 'dallas';
        state = 'tx';
        
        var darURL = 'https://apidarfm.global.ssl.fastly.net/darstations.php?callback=json&city=' + city + '&state=' + state + '&exact=1&partner_token=' + apiKey;
        var darURLEncoded = encodeURI(darURL);

        $.ajax({
            url: darURLEncoded,
            method: "GET"
        }).then(function(response) {
            console.log(darURLEncoded);
            var results = response.result[0].stations;

            for (var i = 0; i < results.length; i++) {
                localStorage.removeItem("genres");
                localStorage.removeItem("stations");

                // add to list of genres
                if (!genres.includes(results[i].genre)) {
                    genres.push(results[i].genre);
                }

                // station info
                var station = {
                    genre: results[i].genre,
                    callsign: results[i].callsign,
                    dial: results[i].dial,
                    slogan: results[i].slogan,
                    websiteurl: results[i].websiteurl,
                    station_id: results[i].station_id,
                    station_image: results[i].station_image
                }

                stations.push(station);
            }
            localStorage.setItem('genres', JSON.stringify(genres));
            localStorage.setItem('stations', JSON.stringify(stations));

            window.location.href = './results.html';
        });
    }
});