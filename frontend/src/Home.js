// Home.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import './index.css';
import Select from 'react-select';  

const Home = () => {
  const [countryData, setCountryData] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [apiKeyError, setApiKeyError] = useState('');
  const [userApiKey, setUserApiKey] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = jwtDecode(token);
    fetchApiKeys();  

  }, [token, navigate]);

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
      fetchCountryData(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchCountryData = (country) => {
    axios
      .get(`http://localhost:3000/auth/country/${country}`, {
        headers: {
          'X-API-Key': userApiKey,
        },
      })
      .then((response) => {
        setCountryData(response.data);
      })
      .catch(() => {
        setCountryData(null);
      });
  };

  const handleGenerateApiKey = async () => {
    try {
      const response = await axios.post('http://localhost:3000/auth/generate-api-key', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApiKeyError(''); // Clear state for any previous error
      fetchApiKeys(); 
    } catch (error) {
      setApiKeyError('Failed to generate API key');      
    }
  };

  const fetchApiKeys = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/api-keys', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApiKeys(response.data);
      if (response.data.length > 0) {
        setUserApiKey(response.data[0].api_key);
      } else {
        setApiKeyError('No API key found. Please generate one.');
      }
    } catch (error) {
      setApiKeyError('Failed to fetch API keys');
    }
  };

  const handleDeleteApiKey = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/auth/api-key/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchApiKeys();
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
