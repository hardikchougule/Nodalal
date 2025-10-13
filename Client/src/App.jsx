// client/src/App.jsx

import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthContext } from './context/AuthContext';

// Import all your pages and components
import Header from './components/Navbar';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddRoomPage from './pages/AddRoomPage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import EditRoomPage from './pages/EditRoomPage';

const AppContent = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timer;

    // --- NEW, CORRECTED TIMER LOGIC ---
    // Pages where the timer SHOULD run for visitors.
    const pagesWithTimer = ['/rooms'];
    const isRoomDetailPage = location.pathname.startsWith('/room/');

    // Start the timer ONLY if the user is not logged in AND they are on a timed page.
    if (!auth.isAuthenticated && (pagesWithTimer.includes(location.pathname) || isRoomDetailPage)) {
      timer = setTimeout(() => {
        // Show a popup message first
        if (window.confirm('Your 30-second preview has ended. Please log in to continue browsing.')) {
          // If they click "OK", redirect to login
          navigate('/login');
        }
      }, 30000); // 30 seconds
    }

    // This cleanup function will cancel the timer if the user navigates away or logs in.
    return () => clearTimeout(timer);

  }, [auth.isAuthenticated, navigate, location.pathname]);

  return (
    <main className="py-3">
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/room/:id" element={<RoomDetailsPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/add-room" element={<AddRoomPage />} />
            <Route path="/edit-room/:id" element={<EditRoomPage />} />
          </Route>
        </Routes>
      </Container>
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Header />
      <AppContent />
    </Router>
  );
};

export default App;