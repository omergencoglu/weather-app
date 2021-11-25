const input = document.getElementById("user-input");
const userLocation = document.getElementById("userLocation");
const temperature = document.getElementById("temperature");
const conditionImage = document.getElementById("conditionImage");
const condition = document.getElementById("condition");
const backgroundGrad = document.getElementById("container");

//backgroud gradients from https://cdpn.io/rDEAl
const dayGrads = [
  [
    { color: "4a4969", position: 0 },
    { color: "7072ab", position: 50 },
    { color: "cd82a0", position: 100 },
  ],
  [
    { color: "757abf", position: 0 },
    { color: "8583be", position: 60 },
    { color: "eab0d1", position: 100 },
  ],
  [
    { color: "82addb", position: 0 },
    { color: "ebb2b1", position: 100 },
  ],
  [
    { color: "94c5f8", position: 1 },
    { color: "a6e6ff", position: 70 },
    { color: "b1b5ea", position: 100 },
  ],
  [
    { color: "b7eaff", position: 0 },
    { color: "94dfff", position: 100 },
  ],
  [
    { color: "9be2fe", position: 0 },
    { color: "67d1fb", position: 100 },
  ],
  [
    { color: "90dffe", position: 0 },
    { color: "38a3d1", position: 100 },
  ],
  [
    { color: "57c1eb", position: 0 },
    { color: "246fa8", position: 100 },
  ],
  [
    { color: "2d91c2", position: 0 },
    { color: "1e528e", position: 100 },
  ],
  [
    { color: "2473ab", position: 0 },
    { color: "1e528e", position: 70 },
    { color: "5b7983", position: 100 },
  ],
  [
    { color: "1e528e", position: 0 },
    { color: "265889", position: 50 },
    { color: "9da671", position: 100 },
  ],
  [
    { color: "1e528e", position: 0 },
    { color: "728a7c", position: 50 },
    { color: "e9ce5d", position: 100 },
  ],
  [
    { color: "154277", position: 0 },
    { color: "576e71", position: 30 },
    { color: "e1c45e", position: 70 },
    { color: "b26339", position: 100 },
  ],
  [
    { color: "163C52", position: 0 },
    { color: "4F4F47", position: 30 },
    { color: "C5752D", position: 60 },
    { color: "B7490F", position: 80 },
    { color: "2F1107", position: 100 },
  ],
  [
    { color: "071B26", position: 0 },
    { color: "071B26", position: 30 },
    { color: "8A3B12", position: 80 },
    { color: "240E03", position: 100 },
  ],
];
const nightGrads = [
  [
    { color: "010A10", position: 30 },
    { color: "59230B", position: 80 },
    { color: "2F1107", position: 100 },
  ],
  [
    { color: "090401", position: 50 },
    { color: "4B1D06", position: 100 },
  ],
  [
    { color: "00000c", position: 80 },
    { color: "150800", position: 100 },
  ],
  [
    { color: "00000c", position: 0 },
    { color: "00000c", position: 0 },
  ],
  [
    { color: "020111", position: 85 },
    { color: "191621", position: 100 },
  ],
  [
    { color: "020111", position: 60 },
    { color: "20202c", position: 100 },
  ],
  [
    { color: "020111", position: 10 },
    { color: "3a3a52", position: 100 },
  ],
  [
    { color: "20202c", position: 0 },
    { color: "515175", position: 100 },
  ],
  [
    { color: "40405c", position: 0 },
    { color: "6f71aa", position: 80 },
    { color: "8a76ab", position: 100 },
  ],
];

//create css declaration for background
const toCSSGradient = (data) => {
  let css = "linear-gradient(to bottom,";
  const len = data.length;

  for (let i = 0; i < len; i++) {
    const item = data[i];
    css += " #" + item.color + " " + item.position + "%";
    if (i < len - 1) css += ",";
  }
  return `${css} )`;
};

//transform unixtimestamp to date and return in minute format
const getTimeInfo = (unixSunrise, unixSunset, unixCurrentTime) => {
  const sunrise = new Date(unixSunrise * 1000);
  const sunriseHour = sunrise.getHours();

  const sunset = new Date(unixSunset * 1000);
  const sunsetHour = sunset.getHours();

  const currentTime = new Date(unixCurrentTime * 1000);
  const currentHour = currentTime.getHours();
  return { sunriseHour, sunsetHour, currentHour };
};

const selectGrads = (current, sunrise, sunset) => {
  if (sunrise >= sunset) {
    if (current > sunrise || current < sunset) {
      return dayGrads;
    } else {
      return nightGrads;
    }
  } else if (sunset > sunrise) {
    if (current < sunrise || current > sunset) {
      return nightGrads;
    } else {
      return dayGrads;
    }
  }
};

//day or night length
const getTimeDifference = (sunrise, sunset, selectedGrads) => {
  if (selectedGrads === dayGrads) {
    if (sunrise <= sunset) {
      return sunset - sunrise;
    } else if (sunrise > sunset) {
      return sunset + 24 - sunrise;
    }
  } else if (selectedGrads === nightGrads) {
    if (sunrise <= sunset) {
      return 24 - sunset + sunrise;
    } else if (sunrise > sunset) {
      return sunrise - sunset;
    }
  }
};

const minutesCalculation = (
  totalhours,
  sunriseHour,
  sunsetHour,
  selectedGrads
) => {
  const sunriseMin = sunriseHour * 60;
  const sunsetMin = sunsetHour * 60;
  const minuteRange = Math.round((totalhours * 60) / selectedGrads.length);
  const baseValue = selectedGrads === dayGrads ? sunriseMin : sunsetMin;

  //create data ranges to map grades
  let x = 1;
  let minuteRangeList = [];
  for (let i = 1; i < selectedGrads.length + 1; i++) {
    if (minuteRange * i + baseValue <= 1440) {
      minuteRangeList.push(minuteRange * i + baseValue);
    } else {
      minuteRangeList.push(minuteRange * x);
      x++;
    }
  }

  //create new list with range and gradients
  const newGrads = {};
  minuteRangeList.forEach((x, i) => (newGrads[x] = selectedGrads[i]));
  return { newGrads, minuteRange };
};

//return conditional gradient according to current time
const selectGradient = (
  currentHour,
  totalhours,
  sunriseHour,
  sunsetHour,
  selectedGrads
) => {
  const current = currentHour * 60;
  const newGrads = minutesCalculation(
    totalhours,
    sunriseHour,
    sunsetHour,
    selectedGrads
  ).newGrads;

  let maxRange = 0;
  if (selectedGrads === dayGrads) {
    maxRange = 15;
  } else {
    maxRange = 9;
  }

  let i = 0;
  while (i < maxRange) {
    if (current <= parseInt(Object.keys(newGrads)[i])) {
      return newGrads[Object.keys(newGrads)[i]];
    }
    i++;
  }
};

//capitalize condition description
const capitalizeInitials = (arr) => {
  const words = arr.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1);
  }

  return words.join(" ");
};

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
        //update divs with new information
        userLocation.innerHTML =
          response.data.name + ", " + response.data.sys.country;
        temperature.innerHTML = Math.round(response.data.main.temp) + "°";
        conditionImage.alt = response.data.weather[0].main;
        conditionImage.src = `img/${response.data.weather[0].icon}.svg`;
        condition.innerHTML = capitalizeInitials(
          response.data.weather[0].description
        );

        const sunrise = parseInt(response.data.sys.sunrise);
        const sunset = parseInt(response.data.sys.sunset);
        const currentTime = parseInt(response.data.dt);

        timeInformation = getTimeInfo(sunrise, sunset, currentTime);
        const selectedGrads = selectGrads(
          timeInformation.currentHour,
          timeInformation.sunriseHour,
          timeInformation.sunsetHour
        );
        const timeDifference = getTimeDifference(
          timeInformation.sunriseHour,
          timeInformation.sunsetHour,
          selectedGrads
        );

        // apply background for day
        backgroundGrad.style.background = toCSSGradient(
          selectGradient(
            timeInformation.currentHour,
            timeDifference,
            timeInformation.sunriseHour,
            timeInformation.sunsetHour,
            selectedGrads
          )
        );
      })
      .catch(function (error) {
        console.log(error);
        console.log("We couldn't find the place you are looking for!");
      });
  }
};

//search when enter pressed
input.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    searchData();
  }
});
