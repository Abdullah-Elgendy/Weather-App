const apiKey = "20319a3a293e4706b2530211252906";
let baseURL = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}`;
let inputLocation = document.querySelector("#inputLocation");
let findLocation = document.querySelector("#findLocation");
let weatherReport = document.querySelector("#weatherReport");

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

if (weatherReport) {
  getLocation();
}

function displayWeather(data) {
  let day = getDayNum(data);
  let container = ` <div class="row gy-4">
                    <div class="col-lg-4">
                        <div class="card text-light text-center">
                            <div class="card-header d-flex justify-content-between">
                                <p class="small m-0">
                                    ${daysOfWeek[day]}
                                </p>
                                <p class="small m-0">
                                    ${data.location.localtime.split(" ")[0]}
                                </p>
                            </div>
                            <div class="card-body py-4 d-flex flex-column gap-3">
                                <h1 class="py-3 text-light text-center">${
                                  data.location.name
                                }</h1>
                                <figure>
                                    <img src="${
                                      data.current.condition.icon
                                    }" alt="" class="img-fluid">
                                </figure>
                                <div class="weather-info">
                                    <h2 class="card-text"> ${
                                      data.current.feelslike_c
                                    }&degC </h2>
                                    <span class="text-info">${
                                      data.current.condition.text
                                    }</span>
                                </div>
                            </div>
                            <div class="card-footer text-light d-flex justify-content-around">
                                <span>
                                    <i class="fa-solid fa-umbrella"></i>
                                    <span> ${
                                      data.forecast.forecastday[0].day
                                        .daily_chance_of_rain
                                    }% </span>
                                </span>
                                <span>
                                    <i class="fa-solid fa-wind"></i>
                                    <span> ${data.current.wind_kph}km/h </span>
                                </span>
                                <span>
                                    <i class="fa-solid fa-compass"></i>
                                    <span> ${data.current.wind_dir} </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card text-light text-center">
                            <div class="card-header d-flex justify-content-center">
                                <p class="small m-0">
                                    ${
                                      day + 1 >= daysOfWeek.length
                                        ? daysOfWeek[0]
                                        : daysOfWeek[day + 1]
                                    }
                                </p>
                            </div>
                            <div class="card-body py-4 d-flex flex-column justify-content-center gap-3">

                                <figure>
                                    <img src="${
                                      data.forecast.forecastday[1].day.condition
                                        .icon
                                    }" alt="" class="img-fluid">
                                </figure>
                                <div class="weather-info">
                                    <h3 class="card-text"> ${
                                      data.forecast.forecastday[1].day.maxtemp_c
                                    } </h3>
                                    <small class="card-text"> ${
                                      data.forecast.forecastday[1].day.mintemp_c
                                    } </small>
                                </div>
                                <span class="text-info">${
                                  data.forecast.forecastday[1].day.condition
                                    .text
                                }</span>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card text-light text-center">
                            <div class="card-header d-flex justify-content-center">
                                <p class="small m-0">
                                    ${
                                      day + 2 >= daysOfWeek.length
                                        ? day + 1 == 6
                                          ? daysOfWeek[0]
                                          : daysOfWeek[1]
                                        : daysOfWeek[day + 2]
                                    }
                                </p>
                            </div>
                            <div class="card-body py-4 d-flex flex-column justify-content-center gap-3">

                                <figure>
                                    <img src="${
                                      data.forecast.forecastday[2].day.condition
                                        .icon
                                    }" alt="" class="img-fluid">
                                </figure>
                                <div class="weather-info">
                                    <h3 class="card-text"> ${
                                      data.forecast.forecastday[2].day.maxtemp_c
                                    } </h3>
                                    <small class="card-text"> ${
                                      data.forecast.forecastday[2].day.mintemp_c
                                    } </small>
                                </div>
                                <span class="text-info">${
                                  data.forecast.forecastday[2].day.condition
                                    .text
                                }</span>
                            </div>
                        </div>
                    </div>`;
  weatherReport.innerHTML = container;
}

//function to get weather data based on query
//forecast requires number of '&days=?' to forecast, in our case: 3
//our query will be &q={location}&days=3
//the {location} can either be (latitude,longtitude) or a location name
async function getData(query) {
  try {
    const response = await fetch(baseURL + query);
    const data = await response.json();
    if (response.status == 200) {
      displayWeather(data);
    } else {
      console.log("Server Error", data.error.message);
    }
  } catch (error) {
    console.log("Error", error);
  }
}

function getDayNum(data) {
  //after getting date from API, create a date object using new Date("{dateValue}");
  // then use .getDay() method to return a number from 0 , 6 and acess the day in daysOfWeek[]
  const date = new Date(data.location.localtime.split(" ")[0]);
  return date.getDay();
}

//function to get location whether from input field or from user's geolocation if allowed.
function getLocation() {
  if (inputLocation.value) {
    let query = `&q=${inputLocation.value}&days=3`;
    getData(query);
  } else {
    navigator.geolocation.getCurrentPosition(success, failure);
  }
}
//this function is called when the user's location is successfully obtained
function success(position) {
  getData(`&q=${position.coords.latitude},${position.coords.longitude}&days=3`);
}
//this function is called if the user's location could not be obtained, ex: user denied access to their location.
//the location search is defaulted to 'london' until user inputs another location or allows access to their location.
function failure(error) {
  console.log(error.message);
  getData("&q=london&days=3");
}

//event listeners for location search
if (findLocation) {
  findLocation.addEventListener("click", function () {
    getLocation();
  });
}

if (inputLocation) {
  inputLocation.addEventListener("input", function () {
    getLocation();
  });
}
