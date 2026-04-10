import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');

                // If no token, stop immediately
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Attach token explicitly (fixes blank page issue)
                const response = await api.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUser(response.data);
            } catch (error) {
                console.error('Failed to authenticate user', error);

                // Clear invalid token
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);

        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};