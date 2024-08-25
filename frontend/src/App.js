// src/App.js
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/SignUp';
import Login from './components/SignIn';
import Lists from './components/Lists';
import CreateList from './components/CreateList';
import ListInterface from './components/ListInterface';
import UserDashboard from './components/UserDashboard';
import EditList from './components/EditList';
import ViewList from './components/ViewList';
import Layout from './components/Layout';
import MyLists from './components/MyLists';
import EditProfile from './components/EditProfile';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

import './App.css';
import AboutUsPage from './components/AboutUsPage';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/create-list" element={<CreateList />} />
          <Route path="/list/:listId" element={<ListInterface />} />
          <Route path="/account/profile" element={<UserDashboard />} />
          <Route path="/my-lists" element={<MyLists />} />
          <Route path="/edit-list/:id" element={<EditList />} />
          <Route path="/view/list/:id" element={<ViewList />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
