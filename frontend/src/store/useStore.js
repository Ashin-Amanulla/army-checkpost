import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const useStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            loading: false,

            login: async (credentials) => {
                try {
                    set({ loading: true });
                    const response = await authAPI.login(credentials);
                    if (response.success) {
                        const { user, token } = response.data;
                        set({
                            user,
                            token,
                            loading: false
                        });
                        localStorage.setItem('token', token);
                        return true;
                    }
                    set({ loading: false });
                    return false;
                } catch (error) {
                    console.error('Login error:', error);
                    toast.error(error.response?.data?.message || 'Login failed');
                    set({ loading: false });
                    return false;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null });
            },

            updateProfile: async (userData) => {
                try {
                    set({ loading: true });
                    const response = await authAPI.updateProfile(userData);
                    if (response.success) {
                        set({ user: response.data });
                        toast.success('Profile updated successfully');
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Update profile error:', error);
                    toast.error(error.response?.data?.message || 'Failed to update profile');
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            checkAuth: async () => {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        set({ user: null, token: null });
                        return false;
                    }

                    const response = await authAPI.getProfile();
                    if (response.success) {
                        set({ user: response.data, token });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('token');
                    set({ user: null, token: null });
                    return false;
                }
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'auth-storage',
            getStorage: () => localStorage,
            partialize: (state) => ({
                token: state.token,
                user: state.user
            })
        }
    )
);

export default useStore; 