const axios = require('axios');

const COUNTRIES_NOW_API = 'https://countriesnow.space/api/v0.1';

const getCountries = async () => {
  try {
    const response = await axios.get(`${COUNTRIES_NOW_API}/countries`);
    return response.data.data.map(country => country.country);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    return [];
  }
};

const getStates = async (country) => {
  try {
    const response = await axios.post(`${COUNTRIES_NOW_API}/countries/states`, {
      country: country
    });
    return response.data.data.states.map(state => state.name);
  } catch (error) {
    console.error('Error fetching states:', error.message);
    return [];
  }
};

const getCities = async (country, state) => {
  try {
    const response = await axios.post(`${COUNTRIES_NOW_API}/countries/state/cities`, {
      country: country,
      state: state
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    return [];
  }
};

module.exports = { getCountries, getStates, getCities };