var cityName = "";
var cityArray = [];

var APIKey = "368601d95cc25d28ac72ffc607f2cff8";

function init() {
  var storageCities = JSON.parse(localStorage.getItem("cityArray"));

  console.log(storageCities);
  if (storageCities !== null) {
    cityArray = storageCities;
    for (i = 0; i < storageCities.length; i++) {
      var liEl = $("<li>").addClass("list-group-item").text(storageCities[i]);
      $("#storageCities").prepend(liEl);
      cityName = storageCities[i];
    }

  } else {

    storageCities = ["There are no cities"];

  }

  weather(storageCities[storageCities.length - 1]);
}

function weather(cityName) {
  $("#currentConditions").empty();



  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=" +
    APIKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    console.log(response);
    $("section").removeClass("d-none");

    var cityHeader = $("<h2>").text(response.name).addClass("p-2 m-2");
    var icon =
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    var currentIcon = $("<img>").attr("src", icon);
    var currentDate = $("<span>").text(
      " (" + dayjs().format("MM/DD/YYYY") + ")"
    );

    cityHeader.append(currentDate, currentIcon);

    var temperature = $("<p>")
      .text("Temperature: " + Math.round(response.main.temp) + "°F")
      .addClass("p-2 m-2");
    var humidity = $("<p>")
      .text("Humidity: " + response.main.humidity + "%")
      .addClass("p-2 m-2");
    var windSpeed = $("<p>")
      .text("Wind Speed: " + Math.round(response.wind.speed) + " MPH")
      .addClass("p-2 m-2");

    var latitude = response.coord.lat;
    var longitude = response.coord.lon;

    $("#currentConditions").append(
      cityHeader,
      temperature,
      humidity,
      windSpeed
    );
    var queryUrlUVIndex =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude={minutely}&units=imperial&appid=" +
      APIKey;
    $.ajax({
      url: queryUrlUVIndex,
      method: "GET",
    }).then(function (response) {

      var uvIndexDisplay = $("<button>");
      if (response.current.uvi < 3) {
        uvIndexDisplay.addClass("btn btn-success");
      } else if (response.current.uvi > 7) {
        uvIndexDisplay.addClass("btn btn-danger");
      } else {
        uvIndexDisplay.addClass("btn btn-warning");
      }
      var uvIndex = $("<p>").text("UV Index: ").addClass("p-2 m-2");

      uvIndex.append(uvIndexDisplay.text(response.current.uvi));
      $("#currentConditions").append(uvIndex);

      $("#forecast").empty();
      for (let i = 1; i < response.daily.length; i++) {
        if (i === 6) {
          break;
        }

        var newDiv = $("<div>").addClass(
          "col-md-2 bg-primary text-white m-auto my-2 rounded"
        );
        var date = ((response.daily[i].dt) * 1000);
        var dateObject = new Date(date);
        var dateDisplay = $("<p>").text(dateObject.toLocaleDateString());
        var icons =
          "https://openweathermap.org/img/w/" +
          response.daily[i].weather[0].icon +
          ".png";
        var forecastIcon = $("<img>").attr("src", icons);
        var forecastTemp = $("<p>").text(
          "Temp: " + Math.round(response.daily[i].temp.max) + "°F"
        );
        var forecastHumidity = $("<p>").text(
          "Humidity: " + response.daily[i].humidity + "%"
        );

        newDiv.append(dateDisplay, forecastIcon, forecastTemp, forecastHumidity);

        $("#forecast").append(newDiv);
      }
    });
  });
}

init();

$("#cityForm").on("submit", function (e) {
  newCityName = $("#userInput").val();
  cityName = newCityName;
  cityArray.push(cityName);
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
  weather(cityName);
});

$(".list-group-item").on("click", function (e) {
  e.preventDefault();
  var cityButton = ($(this).text());

  weather(cityButton);

});