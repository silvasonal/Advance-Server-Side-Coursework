// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash3 } from "react-bootstrap-icons";
import axios from 'axios';
import './styles/index.css'; 
import { jwtDecode } from 'jwt-decode';
import Select from 'react-select';
import { fetchCountryData, generateApiKey, fetchApiKeybyUserID, deleteApiKey } from './services/apiService';
import SharedSnackbar from './SharedComponents/SharedSnackbar';

const Home = () => {
  const [countryData, setCountryData] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyError, setApiKeyError] = useState('');
  const [userApiKey, setUserApiKey] = useState('');
  const [userId, setUserId] = useState('');
  const [countryDataError, setCountryDataError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (userId) {
      getApiKeys();
    }
  }, [userId]);


  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const codes = response.data.map(country => ({
          code: country.cca2,
          name: country.name.common,
        }));
        setCountryCodes(codes);
      })
      .catch(error => {
        console.error('Error fetching country codes:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      getCountryData(selectedCountry);
    }
  }, [selectedCountry]);

  const getCountryData = async (country) => {
    try {
      const response = await fetchCountryData(country, userApiKey);

      if (response) {
        setCountryData(response);
      } else {
        console.error('No valid country data found in the response');
        setCountryData(null);
        setCountryDataError('No country data found.');
      }

    } catch (error) {
      console.error('Error fetching country data:', error.response?.data || error.message || error);
      setCountryData(null);
    }
  };

  const handleGenerateApiKey = async () => {
    try {
      await generateApiKey(token);
      setApiKeyError('');
      getApiKeys();
    } catch (error) {
      setApiKeyError('Failed to generate API key');
    }
  };

  const getApiKeys = async () => {
    try {
      const data = await fetchApiKeybyUserID(userId, token);
      setApiKeys(data);

      if (data.length > 0) {
        setUserApiKey(data[0].api_key);
      } else {
        setApiKeyError('No API key found. Please generate one.');
      }
    } catch (error) {
      setApiKeyError('Failed to fetch API keys');
    }
  };

  const handleDeleteApiKey = async (id) => {
    try {
      await deleteApiKey(id, token);
      setSnackbar({ open: true, message: 'Deleted successfully', severity: 'success' });
      getApiKeys();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete', severity: 'error' });
    }
  };

  return (
    <div>

      {/* Country Data display */}
      {countryDataError && (
        <div className="error-message">
          <p>{countryDataError}</p>
        </div>
      )}

      {/* API Keys section */}
      <div className="api-keys-section">
        <button className="generate-api-key-btn" id="home_generate_api_key_btn" onClick={handleGenerateApiKey} disabled={apiKeys.length > 0} >Generate API Key</button>
        <h3>API Keys</h3>
        {apiKeyError && <p className="api-key-error">{apiKeyError}</p>}
        <ul className="api-key-list">
          {apiKeys.map((key) => (
            <li key={key.id}>
              <span>{key.api_key}</span>
              <button className="btn btn-danger" id="home_delete_api_key_btn" onClick={() => { handleDeleteApiKey(key.id)}}>
                <Trash3 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Country Selection section */}
      <div className="country-selection">
        <h3>Select a Country</h3>
        <Select
          className="select-box"
          id="home_country_select"
          value={countryCodes.find(option => option.value === selectedCountry)}
          onChange={(selectedOption) => setSelectedCountry(selectedOption.value)}
          options={countryCodes.map(country => ({
            value: country.code,
            label: country.name,
          }))}
          placeholder="Select a country"
        />
      </div>

      {countryData && !countryDataError && (
        <div className="country-data">
          <h3>Country Information</h3>
          <p><strong>Name:</strong> {countryData.name}</p>
          <p><strong>Capital:</strong> {countryData.capital}</p>
          <p>
            <strong>Currency:</strong>
            {countryData.currency.map(curr => `${curr.name} | (${curr.symbol})`).join(', ')}
          </p>
          <p><strong>Languages:</strong> {countryData.languages.join(', ')}</p>
          <p>
            <strong>Flag:</strong> <img src={countryData.flag} alt={`Flag of ${countryData.name}`} style={{ width: '50px', height: 'auto' }} />
          </p>
        </div>
      )}
      <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>
  );
};

export default Home;
