import React, { useState, useEffect } from 'react';
import { fetchApiKeys, fetchUsers } from './services/apiService'; 
import './index.css';

const ApiKeys = () => {
    const [apikeys, setApiKeys] = useState([]);
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedApiKeys = await fetchApiKeys(token);
                const fetchedUsers = await fetchUsers(token);
                setApiKeys(fetchedApiKeys);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [token]);

    const getUsername = (userId) => {
        const user = users.find((u) => parseInt(u.id) === userId); 
        return user && user.username ? user.username : 'Unknown';
    };

    const dataTimeFormat = (dateString) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
        return formattedDate;
    };

    return (
        <div className="api-wrapper">
            <h2 className="api-title">API Keys</h2>
            <table className="api-table">
                <thead>
                    <tr>
                        <th>User Name</th>
                        <th>API Key</th>
                        <th>Created At</th>
                        <th>Last Used</th>
                        <th>Usage Count</th>
                    </tr>
                </thead>
                <tbody>
                    {apikeys.length > 0 ? (
                        apikeys.map((key) => (
                            <tr key={key.id}>
                                <td>{getUsername(key.user_id)}</td>
                                <td>{key.api_key}</td>
                                <td>{dataTimeFormat(key.created_at)}</td>
                                <td>{dataTimeFormat(key.last_used)}</td>
                                <td>{key.usage_count}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="api-no-data">No API Keys Found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ApiKeys;
