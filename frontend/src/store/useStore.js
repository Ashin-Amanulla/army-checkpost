import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

const useStore = create(
    persist(
        (set) => ({
            user: null,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authAPI.login(credentials);
                    localStorage.setItem('token', data.token);
                    set({ user: data, isLoading: false });
                    return data;
                } catch (error) {
                    set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null });
            },

            checkAuth: async () => {
                try {
                    const { data } = await authAPI.getProfile();
                    set({ user: data });
                    return data;
                } catch (error) {
                    set({ user: null });
                    localStorage.removeItem('token');
                }
            },

            clearError: () => set({ error: null })
        }),
        {
            name: 'user-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);

export default useStore; 