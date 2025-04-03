// UserManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SharedSnackbar from './SharedComponents/SharedSnackbar';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [updatedRoles, setUpdatedRoles] = useState({}); 
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:3000/auth/users', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleRoleChange = (userId, newRole) => {
        setUpdatedRoles(prevRoles => ({
            ...prevRoles,
            [userId]: newRole,  
        }));
    };

    const saveChanges = async () => {
        try {
            for(const userId in updatedRoles){
                const newrRole = updatedRoles[userId];
                const url = newrRole === "admin" 
                    ? `http://localhost:3000/auth/make-admin/${userId}` 
                    : `http://localhost:3000/auth/make-user/${userId}`;
                await axios.patch(url, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setSnackbar({ open: true, message: 'Changes saved successfully', severity: 'success' });
            fetchUsers(); 
            setUpdatedRoles({}); 
        } catch (error) {
            console.error('Failed to save changes:', error);
            setSnackbar({ open: true, message: 'Failed to save changes', severity: 'error' });
        }                                  
    };
    

    return (
        <div className="user-list-section">
        <h3>User List</h3>
        <table className="user-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Admin</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>
                            {/* Admin Checkbox */}
                            <input
                                type="checkbox"
                                checked={updatedRoles[user.id] ? updatedRoles[user.id] === "admin" : user.role === "admin"} 
                                onChange={(e) => handleRoleChange(user.id, e.target.checked ? "admin" : "user")}  
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    
        {/* Save Changes Button */}
        <div className="save-changes-section">
            <button className="save-changes-btn" onClick={saveChanges}>
                Save Changes
            </button>
        </div>
        <SharedSnackbar snackbar={snackbar} setSnackbar={setSnackbar} />
    </div>    
 
    );
};

export default UserManagement;
