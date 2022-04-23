
    const cityEl = $("#enterCity");
    const searchEl = $("#searchButton");
    const clearEl = $("#clearHistory");
    const nameEl = $("#cityName");
    const currentPicEl = $("#picture");
    const currentTempEl = $("#temperature");
    const currentHumidityEl = $("#humidity");
    const currentWindEl = $("#wind");
    const currentUVEl = $("#uvIndex");
    const historyEl = $("#history");
    var fivedayEl = $("#fiveDays");
    var todayweatherEl = $("#todayWeather");
    let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

    const APIKey = "368601d95cc25d28ac72ffc607f2cff8";



    searchEl.on("click", function(){
        console.log(cityEl.val())
    })