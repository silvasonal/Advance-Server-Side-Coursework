const apiKeyDAO = require('../daos/apiKeyDAO');
const { v4: uuidv4 } = require('uuid'); 

const generateApiKey = async (userId) => {
    const apiKey = uuidv4(); 
    return apiKeyDAO.createApiKey(userId, apiKey);
};

const deleteApiKey = async (apiKeyId) => {
    return apiKeyDAO.deleteApiKey(apiKeyId);
};

const getApiKeysByUserId = async (userId) => {
    return apiKeyDAO.getApiKeysByUserId(userId);
};

const getApiKeys = async () => {
    return apiKeyDAO.getApiKeys();
};

module.exports = { generateApiKey, deleteApiKey, getApiKeysByUserId, getApiKeys };