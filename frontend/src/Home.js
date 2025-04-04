// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';
import { jwtDecode } from 'jwt-decode';
import Select from 'react-select';
import { fetchCountryData, generateApiKey, fetchApiKeybyUserID, deleteApiKey } from './services/apiService';

const Home = () => {
  const [countryData, setCountryData] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyError, setApiKeyError] = useState('');
  const [userApiKey, setUserApiKey] = useState('');
  const [userId, setUserId] = useState('');

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
      const response = await fetchCountryData(country, userApiKey)
      setCountryData(response.data);
    } catch (error) {
      console.error('Error fetching country data:', error);
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
      getApiKeys();
    } catch (error) {
      setApiKeyError('Failed to delete API key');
    }
  };

  return (
    <div>

      {/* API Keys section */}
      <div className="api-keys-section">
        <button className="generate-api-key-btn" onClick={handleGenerateApiKey}>Generate API Key</button>
        <h3>API Keys</h3>
        {apiKeyError && <p className="api-key-error">{apiKeyError}</p>}
        <ul className="api-key-list">
          {apiKeys.map((key) => (
            <li key={key.id}>
              <span>{key.api_key}</span>
              <button onClick={() => handleDeleteApiKey(key.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Country Selection section */}
      <div className="country-selection">
        <h3>Select a Country</h3>
        <Select
          className="select-box"
          id="countries"
          value={countryCodes.find(option => option.value === selectedCountry)}
          onChange={(selectedOption) => setSelectedCountry(selectedOption.value)}
          options={countryCodes.map(country => ({
            value: country.code,
            label: country.name,
          }))}
          placeholder="Select a country"
        />
      </div>

      {countryData && (
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
    </div>
  );
};

export default Home;
