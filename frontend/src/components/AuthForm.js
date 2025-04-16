import React, { useState } from 'react';
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

            const userExists = initialUsers.some((user) => user.login === login);
            if (userExists) {
                setErrorMessage('Пользователь с таким логином уже зарегистрирован.');
                return;
            }

            console.log('Регистрация:', { login, password, telegramUsername });
            setIsRegistering(false);
            setErrorMessage('Регистрация прошла успешно. Войдите, используя свой логин и пароль.');

            return;
        } else {
            const user = initialUsers.find((user) => user.login === login && user.password === password);

            if (user) {
                localStorage.setItem('telegramUsername', user.telegramUsername);
                onLogin(user.role);
            } else {
                setErrorMessage('Неверный логин или пароль.');
            }
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
