
$(document).ready(function () {
    //Global Variables
    var cityName = "";
    var cityArray = [];
  
    // unique API key for my openWeather account
    var APIKey = "c1cabeb697dacad88448e7c4021a7ec7";
  
    //function for getting items from local storage
    function init() {
      //parses strings from storage
      var storageCities = JSON.parse(localStorage.getItem("cityArray"));
  
      console.log(storageCities);
      //checks to see if there is anything in storage
      if (storageCities !== null) {
        cityArray = storageCities;
        //populates card under the search bar with most recent searches 
      for (i = 0; i < storageCities.length; i++) {
          var liEl = $("<li>").addClass("list-group-item").text(storageCities[i]);
          $("#storage-cities").prepend(liEl);
          //sets the most recent city to the cityName 
          cityName = storageCities[i];
        }
      
      } else {
  
        storageCities = ["There are no cities"];
  
      }
  
      weather(storageCities[storageCities.length-1]);
    }
  
    //uses open weather API to get current conditions and 5 day forecast
    function weather(cityName) {
      //clear out current city forecast
      $("#current-conditions").empty();
  
      
  
      var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName +
        "&units=imperial&appid=" +
        APIKey;
  
      //current conditions API call 
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
      
        console.log(response);
      //reveals the forecast container
      $("section").removeClass("d-none");
      
        // city name & current weather Icon
        var cityHeader = $("<h2>").text(response.name).addClass("p-2 m-2");
        var icon =
          "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        var currentIcon = $("<img>").attr("src", icon);
        var currentDate = $("<span>").text(
          " (" + dayjs().format("MM/DD/YYYY") + ")"
        );
  
        //append city and icon together to appear on the same line
        cityHeader.append(currentDate, currentIcon);
  
        //current temperature, humidity, and wind speed - decimal values are rounded 
        var temperature = $("<p>")
          .text("Temperature: " + Math.round(response.main.temp) + "°F")
          .addClass("p-2 m-2");
        var humidity = $("<p>")
          .text("Humidity: " + response.main.humidity + "%")
          .addClass("p-2 m-2");
        var windSpeed = $("<p>")
          .text("Wind Speed: " + Math.round(response.wind.speed) + " MPH")
          .addClass("p-2 m-2");
  
        //sets the latitude and longitude that will be used in second API call 
        var latitude = response.coord.lat;
        var longitude = response.coord.lon;
  
         //appends dynamic elements to HTML
        $("#current-conditions").append(
          cityHeader,
          temperature,
          humidity,
          windSpeed
        );
        //open weather "one call API"
        var queryUrlUVIndex =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          latitude +
          "&lon=" +
          longitude +
          "&exclude={minutely}&units=imperial&appid=" +
          APIKey;
        //UV Index and 5 day forecast API call 
        $.ajax({
          url: queryUrlUVIndex,
          method: "GET",
        }).then(function (response) {
          
          var uvIndexDisplay = $("<button>");
          if (response.current.uvi < 3){
               uvIndexDisplay.addClass("btn btn-success");
          } else if (response.current.uvi > 7) {
               uvIndexDisplay.addClass("btn btn-danger");
          }  else {
              uvIndexDisplay.addClass("btn btn-warning");
          }
          var uvIndex = $("<p>").text("UV Index: ").addClass("p-2 m-2");
  
          uvIndex.append(uvIndexDisplay.text(response.current.uvi));
         
          $("#current-conditions").append(uvIndex);
  
          // 5 DAY FORECAST
          $("#forecast").empty();
  
          for (let i = 1; i < response.daily.length; i++) {
            if (i === 6) {
              break;
            }
  
            // creates new div for 5 day forecast
            var newDiv = $("<div>").addClass(
              "col-md-2 bg-primary text-white m-auto my-2 rounded"
            );
            var date = ((response.daily[i].dt)* 1000);
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
  
    //FUNCTION CALLS
    init();
  
    //EVENT LISTENERS
    $("#city-form").on("submit", function (e) {
      //prevents default refresh
      //  e.preventDefault();
      //takes in user city selection
      newCityName = $("#user-input").val();
      //adds user input to global variable
      cityName = newCityName;
      //pushes the newest searched city into the array for storage
      cityArray.push(cityName);
      // sets and stringifies the array for local storage
      localStorage.setItem("cityArray", JSON.stringify(cityArray));
      // calls weather function
      weather(cityName);
    });
  
    $(".list-group-item").on("click", function(e) {
      e.preventDefault();
      console.log("you clicked on a list item");
      var cityButton = ($(this).text());
    
      weather(cityButton);
  
    });
  
  });