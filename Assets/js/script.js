// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city

var apiKey = "368601d95cc25d28ac72ffc607f2cff8";
var currentWeatherEl = $("#currentWeather");
var latitude;
var longitude;


function start(e) {
    e.preventDefault();
    var cityNameForm = $("#cityNameForm").val();
    $("#currentWeather").empty();
    getCurrentWeather(cityNameForm);

}


function getCurrentWeather(city) {

    var requestUrlCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    console.log(requestUrlCurrentWeather);
    fetch(requestUrlCurrentWeather)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var cityName = $("<h2>").text(data.name).addClass("p-2 m-2 d-inline");
            var date = $("<h2>").text(" (" + dayjs().format("MM/DD/YYYY") + ")").addClass("d-inline me-4");
            var iconLink = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
            var icon = $("<img>").attr("src", iconLink);

            var temperature = $("<p>").text("Temp: " + Math.round(data.main.temp) + "°F").addClass("m-2");
            var humidity = $("<p>").text("Humidity: " + data.main.humidity + "%").addClass("m-2");
            var wind = $("<p>").text("Wind: " + Math.round(data.wind.speed) + "MPH").addClass("m-2");

            latitude = data.coord.lat;
            longitude = data.coord.lon;

            currentWeatherEl.append(cityName, date, icon, temperature, wind, humidity)

            getUvIndex();
        });
}

function getUvIndex() {
    var requestUrlUvIndex = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude={minutely}&units=imperial&appid=" + apiKey;
    console.log(requestUrlUvIndex);
    fetch(requestUrlUvIndex)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var uvIndexBox = $("<span>").text(data.current.uvi).addClass("border p-1");
            if (data.current.uvi < 3) {
                uvIndexBox.addClass("bg-success")
            }
            else if (data.current.uvi > 7) {
                uvIndexBox.addClass("bg-danger text-white")
            }
            else {
                uvIndexBox.addClass("bg-warning")
            }
            var uvIndex = $("<p>").text("Uv Index: ").addClass("m-2")
            uvIndex.append(uvIndexBox);
            currentWeatherEl.append(uvIndex);
        });
}





$("#searchButton").on("click", start);