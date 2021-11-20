const weather = () => {
  axios
    .get(
      `http://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=${config.WEATHER_API}&units=metric`
    )
    .then(function (response) {
      console.log(response.data.main.temp);
      console.log(response.data.weather[0].main);
    })
    .catch(function (error) {
      console.log(error);
    });
};
weather();
