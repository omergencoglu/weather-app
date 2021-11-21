const input = document.getElementById("user-input");
const userLocation = document.getElementById("userLocation");
const temperature = document.getElementById("temperature");
const conditionImage = document.getElementById("conditionImage");
const condition = document.getElementById("condition");

const searchData = () => {
  const locationInput = input.value;
  if (!locationInput || Number.isInteger(parseInt(locationInput))) {
    return console.log("There is no such place!");
  } else {
    axios
      .get(
        `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${config.WEATHER_API}&units=metric`
      )
      .then(function (response) {
        console.log(response.data);
        userLocation.innerHTML =
          response.data.name + ", " + response.data.sys.country;
        temperature.innerHTML = Math.round(response.data.main.temp);
        conditionImage.alt = response.data.weather[0].main;
        conditionImage.src = `img/${response.data.weather[0].icon}.svg`;
        condition.innerHTML = response.data.weather[0].main;
      })
      .catch(function (error) {
        console.log(error);
        console.log("We couldn't find the place you are looking for!");
      });
  }
};

input.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    searchData();
  }
});
