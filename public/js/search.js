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
      return "error";
    }
  }
}

module.exports = { searchData: searchData };
