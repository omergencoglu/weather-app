const searchData = () => {
  const location = document.getElementById("user-input").value;

  axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${config.WEATHER_API}&units=metric`
    )
    .then(function (response) {
      console.log(response.data.main.temp);
      console.log(response.data.weather[0].main);
    })
    .catch(function (error) {
      console.log(error);
    });
};
