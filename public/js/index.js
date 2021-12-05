const input = document.getElementById("userInput");
const userLocation = document.getElementById("userLocation");
const temperature = document.getElementById("temperature");
const conditionImage = document.getElementById("conditionImage");
const conditionText = document.getElementById("conditionText");
const backgroundGrad = document.getElementById("container");

const dayGrads = [
  "day-1",
  "day-2",
  "day-3",
  "day-4",
  "day-5",
  "day-6",
  "day-7",
  "day-8",
  "day-9",
  "day-10",
  "day-11",
  "day-12",
  "day-13",
  "day-14",
  "day-15",
];

const nightGrads = [
  "night-1",
  "night-2",
  "night-3",
  "night-4",
  "night-5",
  "night-6",
  "night-7",
  "night-8",
  "night-9",
];

//transform unixtimestamp to date and return it in minute format
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

console.log(response);
//  update divs with new information
userLocation.innerHTML = response.data.name + ", " + response.data.sys.country;
temperature.innerHTML = Math.round(response.data.main.temp) + "°";
conditionImage.alt = response.data.weather[0].main;
conditionImage.src = `img/${response.data.weather[0].icon}.svg`;
conditionText.innerHTML = capitalizeInitials(
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
const backgroundGradClass = backgroundGrad.classList;

backgroundGradClass.remove(
  `${backgroundGradClass[backgroundGradClass.length - 1]}`
);

backgroundGradClass.add(
  selectGradient(
    timeInformation.currentHour,
    timeDifference,
    timeInformation.sunriseHour,
    timeInformation.sunsetHour,
    selectedGrads
  )
);

// const searchData = () => {
//   const locationInput = input.value;
//   if (!locationInput || Number.isInteger(parseInt(locationInput))) {
//     return console.log("There is no such place!");
//   } else {
//     axios
//       .get(
//         `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${weatherAPI}&units=metric`
//       )
//       .then(function (response) {
//         //update divs with new information
//         userLocation.innerHTML =
//           response.data.name + ", " + response.data.sys.country;
//         temperature.innerHTML = Math.round(response.data.main.temp) + "°";
//         conditionImage.alt = response.data.weather[0].main;
//         conditionImage.src = `img/${response.data.weather[0].icon}.svg`;
//         conditionText.innerHTML = capitalizeInitials(
//           response.data.weather[0].description
//         );

//         const sunrise = parseInt(response.data.sys.sunrise);
//         const sunset = parseInt(response.data.sys.sunset);
//         const currentTime = parseInt(response.data.dt);

//         timeInformation = getTimeInfo(sunrise, sunset, currentTime);
//         const selectedGrads = selectGrads(
//           timeInformation.currentHour,
//           timeInformation.sunriseHour,
//           timeInformation.sunsetHour
//         );
//         const timeDifference = getTimeDifference(
//           timeInformation.sunriseHour,
//           timeInformation.sunsetHour,
//           selectedGrads
//         );
//         const backgroundGradClass = backgroundGrad.classList;

//         backgroundGradClass.remove(
//           `${backgroundGradClass[backgroundGradClass.length - 1]}`
//         );

//         backgroundGradClass.add(
//           selectGradient(
//             timeInformation.currentHour,
//             timeDifference,
//             timeInformation.sunriseHour,
//             timeInformation.sunsetHour,
//             selectedGrads
//           )
//         );
//       })
//       .catch(function (error) {
//         console.log(error);
//         console.log("We couldn't find the place you are looking for!");
//       });
//   }
// };

//search when enter pressed
input.addEventListener("keyup", ({ key }) => {
  if (key === "Enter") {
    searchData();
  }
});
