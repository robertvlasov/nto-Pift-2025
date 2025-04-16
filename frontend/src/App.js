import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import HelpPage from './components/HelpPage';
import AdminPage from './components/AdminPage';
import './App.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);


    useEffect(() => {
        const storedAuth = localStorage.getItem('isLoggedIn');
        const storedRole = localStorage.getItem('userRole');
        const storedUsername = localStorage.getItem('telegramUsername');

        if (storedAuth === 'true') {
            setIsLoggedIn(true);
            setUserRole(storedRole);
        }
    }, []);


    const handleLogin = (role) => {
        setIsLoggedIn(true);
        setUserRole(role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', role);
        if (role === 'admin') {
            window.location.href = '/admin';
        } else {
            window.location.href = '/help';
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('telegramUsername');
        window.location.href = '/auth';
    };


    return (
        <Router>
            <div className="app-container">
                <Routes>
                    <Route path="/auth" element={<AuthForm onLogin={handleLogin} />} />
                    <Route
                        path="/help"
                        element={isLoggedIn ? <HelpPage onLogout={handleLogout} /> : <Navigate to="/help" />}
                    />
                    <Route
                        path="/admin"
                        element={
                            isLoggedIn && userRole === 'admin' ? (
                                <AdminPage onLogout={handleLogout} />
                            ) : (
                                <Navigate to="/admin" />
                            )
                        }
                    />
                    <Route path="/" element={<Navigate to="/auth" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
