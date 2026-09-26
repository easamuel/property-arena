/* eslint-disable @typescript-eslint/no-explicit-any */
// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import { API, getApiBaseUrl } from '../services/api';

const REMEMBER_KEY = 'auth-remember';

const shouldRemember = () => localStorage.getItem(REMEMBER_KEY) !== '0';

/** "Remember me" keeps the session in localStorage; otherwise it lives in sessionStorage. */
const authStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name) ?? sessionStorage.getItem(name),
  setItem: (name, value) => {
    const [target, other] = shouldRemember()
      ? [localStorage, sessionStorage]
      : [sessionStorage, localStorage];
    target.setItem(name, value);
    other.removeItem(name);
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

interface AuthState {
  accessToken: string | null;
  user: any | null;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string, remember?: boolean) => Promise<any>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ user: any; devLink?: string }>;
  logout: () => void;

  setUser: (user: any | null) => void;
  setSession: (user: any, accessToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      loading: false,
      error: null,

      login: async (email, password, remember = true) => {
        set({ loading: true, error: null });
        try {
          const data = await API(`${getApiBaseUrl()}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            auth: false,
          });
          localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
          set({ accessToken: data.data.tokens.accessToken, user: data.data.user });
          return data.data.user;
        } catch (err: any) {
          if (err.status >= 400 && err.status < 500) {
            set({ error: err.message });
          }
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      signup: async (name, email, password, role) => {
        set({ loading: true, error: null });
        try {
          const data = await API(`${getApiBaseUrl()}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role }),
            auth: false,
          });
          localStorage.setItem(REMEMBER_KEY, '1');
          set({ accessToken: data.data.tokens.accessToken, user: data.data.user });
          return { user: data.data.user, devLink: data.data.devLink };
        } catch (err: any) {
          if (err.status >= 400 && err.status < 500) {
            set({ error: err.message });
          }
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      logout: () => {
        set({ accessToken: null, user: null });
      },

      setUser: (user) => {
        set({ user });
      },

      setSession: (user, accessToken) => {
        localStorage.setItem(REMEMBER_KEY, '1');
        set({ user, accessToken });
      },
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => authStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);
