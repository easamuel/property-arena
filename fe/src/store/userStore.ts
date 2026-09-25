/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { API } from '@/services/api';
import { useAuthStore } from './authStore';

const BASE_URL = import.meta.env.VITE_API_URL as string;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface UserStore {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;

  getAllUsers: (params?: Record<string, any>) => Promise<void>;
  getUserById: (id: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateUserById: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  clearSelectedUser: () => void;
}

export const useUserStore = create<UserStore>()(
  devtools((set) => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,

    getAllUsers: async (params = {}) => {
      set({ loading: true, error: null });
      try {
        const query = new URLSearchParams(params).toString();
        const response = await API(`${BASE_URL}/users?${query}`, {
          method: 'GET', auth: true,
        });
        set({ users: response.data });
      } catch (err: any) {
        console.error('Failed to fetch users:', err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    getCurrentUser: async () => {
      set({ loading: true, error: null });
      try {
        const response = await API(`${BASE_URL}/users/me`, {
          method: 'GET', auth: true
        });
        set({ selectedUser: response.data });
      } catch (err: any) {
        console.error(`Failed to fetch user:`, err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    getUserById: async (id: string) => {
      set({ loading: true, error: null });
      try {
        const response = await API(`${BASE_URL}/users/${id}`, {
          method: 'GET', auth: true
        });
        set({ selectedUser: response.data });
      } catch (err: any) {
        console.error(`Failed to fetch user ${id}:`, err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    updateUser: async (updates: Partial<User>) => {
      set({ loading: true, error: null });
      try {
        await API(`${BASE_URL}/users`, {
          method: 'PATCH', auth: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        const response = await API(`${BASE_URL}/users/me`, {
          method: 'GET',
          auth: true,
        });

        const setUser = useAuthStore.getState().setUser;
        setUser(response.data); 
        // Optionally update selectedUser if it's the current user
        set((state) => ({
          selectedUser:
            state.selectedUser?.id === response.data.id ? response.data : state.selectedUser,
        }));
      } catch (err: any) {
        console.error('Failed to update current user:', err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },
  
    updateUserById: async (id: string, updates: Partial<User>) => {
      set({ loading: true, error: null });
      try {
        const response = await API(`${BASE_URL}/users/`, {
          method: 'PATCH', auth: true,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
        // Update the user in the list if it exists
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? response.data : user
          ),
          selectedUser: state.selectedUser?.id === id ? response.data : state.selectedUser,
        }));
      } catch (err: any) {
        console.error(`Failed to update user ${id}:`, err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    deleteUser: async (id: string) => {
      set({ loading: true, error: null });
      try {
        await API(`${BASE_URL}/users/${id}`, {
          method: 'DELETE', auth: true
        });
        // Remove from list if present
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        }));
      } catch (err: any) {
        console.error(`Failed to delete user ${id}:`, err);
        set({ error: err.message });
      } finally {
        set({ loading: false });
      }
    },

    clearSelectedUser: () => {
      set({ selectedUser: null });
    },
  }))
);
