import React, { useEffect, useState, createContext } from 'react';
import axiosInstance from './../utlis/axiosInstance';
import { API_PATHS } from '../utlis/apiPaths';

export const UserContext = createContext();


const UserProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (user) return
        const accessToken = localStorage.getItem('token')
        if (!accessToken) {
            setLoading(false)
            return;
        }
        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE)
                setUser(response.data)
            }
            catch (error) {
                console.error("User Not Authenticated", error);
                clearUser();
            }
            finally {
                setLoading(false);
            }
        };
        fetchUser();

    }, []);
    const updateUser = (userData) => {
        setUser(userData)
        localStorage.setItem('token', userData.token)
        setLoading(false)
    }
    
    const clearUser = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;