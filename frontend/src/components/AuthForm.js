import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = ({ onLogin }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handleCheck = async (login, password) => {
        try {
            const response = await axios.post(`http://localhost:8000/transactions/verdict/`, [login, password]);
            handleGetAnswer()
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };
    const handleGetAnswer = async () => {
        try {
            const response = await axios.get('http://localhost:8000/transactions/');
            let user = response.data
            if (user) {
                localStorage.setItem('telegramUsername', user.telegramUsername);
                onLogin(user.role);
            } else {
                setErrorMessage('Неверный логин или пароль.');
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!login || !password) {
            setErrorMessage('Пожалуйста, заполните все поля.');
            return;
        }


        handleCheck(login, password)

    };


    return (
        <div className="auth-form-container">
            <div className="auth-form">
                <h2>Авторизация</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="login">Логин:</label>
                        <input
                            type="text"
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-control"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthForm;
