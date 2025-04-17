import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [telegramUsername, setTelegramUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const initialUsers = [
        { login: 'admin', password: 'admin', role: 'admin', telegramUsername: '@Werzant' },
        { login: 'asd', password: 'asd', role: 'help', telegramUsername: '@user' },
    ];
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

    const handleRegistration = async (login, password, tgid) => {
        try {
            const response = await axios.post(`http://localhost:8000/transactions/verdict/`, [login, password, tgid]);
            handleGetAnswer()
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (!login || !password) {
            setErrorMessage('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        if (isRegistering) {
            if (!telegramUsername) {
                setErrorMessage('Пожалуйста, укажите имя пользователя Telegram для регистрации.');
                return;
            }

            console.log('Регистрация:', { login, password, telegramUsername });
            handleRegistration(login, password, telegramUsername);
            setIsRegistering(false);
            setErrorMessage('Регистрация прошла успешно. Войдите, используя свой логин и пароль.');

            return;
        } else {
            handleCheck(login,password)
        }
    };


    const toggleFormMode = () => {
        setIsRegistering(!isRegistering);
        setErrorMessage('');
    };

    return (
        <div className="auth-form-container">
            <div className="auth-form">
                <h2>{isRegistering ? 'Регистрация' : 'Авторизация'}</h2>
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
                    {isRegistering && (
                        <div className="form-group">
                            <label htmlFor="telegram">Telegram Username:</label>
                            <input
                                type="text"
                                id="telegram"
                                value={telegramUsername}
                                onChange={(e) => setTelegramUsername(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary">
                        {isRegistering ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </form>
                <button className="btn btn-secondary toggle-btn" onClick={toggleFormMode}>
                    {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </button>
            </div>
        </div>
    );
};

export default AuthForm;
