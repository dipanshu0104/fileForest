import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  allSessions: [],
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        identifier,
        password,
      });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error verifying email",
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    // await new Promise((resolve)=> setTimeout((resolve, 1000)))
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },

  updateProfile: async ({ username, newPassword, currentPassword }) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axios.put(`${API_URL}/update-profile`, {
        username,
        newPassword,
        currentPassword,
      });

      set((state) => ({
        user: res.data.user,
        isLoading: false,
        message: res.data.message,
      }));

      return res.data.user;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Profile update failed",
        isLoading: false,
      });
      throw error;
    }
  },
  getSessions: async () => {
    try {
      const response = await axios.get(`${API_URL}/sessions`);
      set({
        allSessions: response.data.sessions,
        message: response.data.message,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error getting sessions",
      });
      throw error;
    }
  },
  terminateSession: async (sessionId) => {
    try {
      const response = await axios.delete(`${API_URL}/sessions/${sessionId}`);
      set({
        allSessions: response.data.sessions,
        meaage: response.data.message,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error getting sessions",
      });
      throw error;
    }
  },

  updateAvatar: (avatarUrl) =>
    set((state) => ({
      user: {
        ...state.user,
        avatar: avatarUrl,
      },
    })),
}));
