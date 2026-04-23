const locationAPI = {
  async getCountries() {
    try {
      const response = await fetch('/api/locations/countries');
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      return [];
    }
  },

  async getStates(country) {
    try {
      const response = await fetch('/api/locations/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country })
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching states:', error);
      return [];
    }
  },

  async getCities(country, state) {
    try {
      const response = await fetch('/api/locations/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, state })
      });
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  },

  populateSelect(selectElement, items, defaultText = 'Select an option') {
    selectElement.innerHTML = `<option value="">${defaultText}</option>`;
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    });
    selectElement.disabled = false;
  },

  clearSelect(selectElement) {
    selectElement.innerHTML = '<option value="">Select an option</option>';
    selectElement.disabled = true;
  }
};

async function initLocationSelectors() {
  const countrySelect = document.getElementById('country');
  const stateSelect = document.getElementById('state');
  const citySelect = document.getElementById('city');

  if (!countrySelect) return;

  const countries = await locationAPI.getCountries();
  locationAPI.populateSelect(countrySelect, countries, 'Select Country');

  countrySelect.addEventListener('change', async () => {
    const country = countrySelect.value;
    stateSelect.disabled = true;
    citySelect.disabled = true;
    locationAPI.clearSelect(stateSelect);
    locationAPI.clearSelect(citySelect);

    if (country) {
      const states = await locationAPI.getStates(country);
      locationAPI.populateSelect(stateSelect, states, 'Select State');
      stateSelect.disabled = false;
    }
  });

  stateSelect.addEventListener('change', async () => {
    const country = countrySelect.value;
    const state = stateSelect.value;
    citySelect.disabled = true;
    locationAPI.clearSelect(citySelect);

    if (country && state) {
      const cities = await locationAPI.getCities(country, state);
      locationAPI.populateSelect(citySelect, cities, 'Select City');
      citySelect.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', initLocationSelectors);