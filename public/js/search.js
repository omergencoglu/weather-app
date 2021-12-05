const axios = require("axios");

async function searchData(locationInput, weatherAPI) {
  if (!locationInput || Number.isInteger(parseInt(locationInput))) {
    return console.log("There is no such place!");
  } else {
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${weatherAPI}&units=metric`
      );
      return response;
    } catch (error) {
      console.log(error);
      console.log("We couldn't find the place you are looking for!");
    }
  }
}

module.exports = { searchData: searchData };
