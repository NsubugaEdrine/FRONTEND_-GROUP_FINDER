import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupDetail from './pages/GroupDetail';
import CreateGroup from './pages/CreateGroup';
import BrowseGroups from './pages/BrowseGroups';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ChatRoom from './pages/ChatRoom';
import AppLayout from './components/AppLayout';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse" element={<BrowseGroups />} />
            <Route path="/group/:id" element={<GroupDetail />} />
            <Route path="/create-group" element={<CreateGroup />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
