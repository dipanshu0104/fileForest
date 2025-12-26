import React, { Children } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import Dashboard from './components/dashboard/Dashboard'
import Page from './ui/Page';
import Layout from "./ui/Layout";
import UserLayout from './ui/Userlayout'
import { Toaster } from 'react-hot-toast';
import FileDetailPage from './ui/FileDetailPage'

import Settings from "./pages/Settings"
import Sessions from './pages/Sessions'
import { useEffect } from 'react';

import Signup from './pages/Signup';
import Login from './pages/Login';
import EmailVerification from './pages/EmailVerification'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword';
import { useAuthStore } from './store/authStore';

import LoadingSpinner from "./components/authcomp/LoadingSpinner";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return children;
};
// redirect the authenticated users to the home page.

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children;
}

function App() {

  const { isCheckingAuth, checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      {/* toastOptions={{
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
        },
      }} */}
      {/* <Dashboard /> */}
      <Router>
        <Routes>

          {/* authentication routes */}

          <Route path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <Signup />
              </RedirectAuthenticatedUser>
            } />

          <Route path="/login"
            element={
              <RedirectAuthenticatedUser>
                <Login />
              </RedirectAuthenticatedUser>
            } />

          <Route path="/verify-email" element={<EmailVerification />} />

          <Route path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPassword />
              </RedirectAuthenticatedUser>
            } />

          <Route path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPassword />
              </RedirectAuthenticatedUser>
            } />

          {/* Wrap all pages inside Layout */}
          <Route path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>

            <Route index
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

            <Route path=":pageName"
              element={
                <ProtectedRoute>
                  <Page />
                </ProtectedRoute>
              } /> {/* Dynamic route */}


            <Route path="/file/:filename"
              element={
                <ProtectedRoute>
                  <FileDetailPage />
                </ProtectedRoute>
              } />
          </Route>

          <Route path='/user'
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }>

            <Route path="/user/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } /> {/* Dynamic route */}

            <Route path='/user/sessions'
              element={
                <ProtectedRoute>
                  <Sessions />
                </ProtectedRoute>
              } />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App