
import React, { useState } from 'react';
import './HelpPage.css';

const HelpPage = ({ onLogout }) => {
    const [isRequestFormVisible, setIsRequestFormVisible] = useState(false);
    const [requestText, setRequestText] = useState('');
    const [telegramUsername, setTelegramUsername] = useState(localStorage.getItem('telegramUsername') || '');

    const handleRequestClick = () => {
        setIsRequestFormVisible(true);
    };


    const handleSendRequest = () => {
        alert('Запрос отправлен: ' + requestText);
        let token = "7857056745:AAG0w_DTcPs-MtxIom3eAZBMrP-mMhW6zAA";
        let chat_id = 2074105590;
        const formattedRequest = `<b>Новый запрос от </b> ${telegramUsername}\n<b>Сообщение: </b>${requestText}`;
        const encodedRequest = encodeURIComponent(formattedRequest);
        let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&text=${encodedRequest}&parse_mode=HTML`;
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url, true);
        oReq.send();
        setIsRequestFormVisible(false);
        setRequestText('');
    };

    return (
        <div className="help-page-container">
            <div className="help-page">
                <button className="btn btn-logout" onClick={onLogout}>Выйти</button>
                <h2>Нужна помощь?</h2>
                <p className="help-text">Свяжитесь с нами удобным для вас способом:</p>
                <div className="contact-info">
                    <div className="contact-item">
                        <i className="fas fa-envelope"></i>
                        <span>Email: support@example.com</span>
                    </div>
                    <div className="contact-item">
                        <i className="fas fa-phone"></i>
                        <span>Телефон: +7 (495) 123-45-67</span>
                    </div>
                </div>
                {!isRequestFormVisible && (
                    <button className="btn btn-request" onClick={handleRequestClick}>
                        Оставить запрос
                    </button>
                )}
                {isRequestFormVisible && (
                    <div className="request-form">
                        <textarea
                            placeholder="Опишите ваш запрос"
                            value={requestText}
                            onChange={(e) => setRequestText(e.target.value)}
                        />
                        <button className="btn btn-send" onClick={handleSendRequest}>
                            Отправить
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpPage;
