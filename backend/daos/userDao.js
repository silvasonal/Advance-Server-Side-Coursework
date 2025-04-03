const pool = require('../config/db');

// Function to create a new user
const createUser = async (username, password) => {
  try {
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, password]
    );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error creating user');
  }
};


// Function to find a user by their username
const findUserByUsername = async (username) => {
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
   );
    return result.rows[0];

  } catch (error) {
    throw new Error('Error fetching user');
  }
};

// Function to find a user 
const getUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows; 
  } catch (error) {
    throw new Error('Error fetching users');
  }
}
 
// Function to update a user's role 
const updateUserRole = async (userId, newRole) => {
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
      [newRole, userId]
    );
    return result.rows[0]; 
  } catch (error) {
    throw new Error('Error updating user role');
  }
};


module.exports = { findUserByUsername, createUser,getUsers,updateUserRole };

