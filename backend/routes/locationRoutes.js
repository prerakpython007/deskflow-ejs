const express = require('express');
const router = express.Router();
const { getCountries, getStates, getCities } = require('../services/locationService');

router.get('/countries', async (req, res) => {
  try {
    const countries = await getCountries();
    res.json({ success: true, data: countries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/states', async (req, res) => {
  try {
    const { country } = req.body;
    const states = await getStates(country);
    res.json({ success: true, data: states });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/cities', async (req, res) => {
  try {
    const { country, state } = req.body;
    const cities = await getCities(country, state);
    res.json({ success: true, data: cities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;