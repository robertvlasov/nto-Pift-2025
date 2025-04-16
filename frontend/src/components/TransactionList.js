





import React, { useState } from 'react';
import './TransactionList.css';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';

const TransactionList = ({ transactions, onStatusChange }) => {
    const [expandedTransactionId, setExpandedTransactionId] = useState(null);

    const handleInfoClick = (transactionId) => {
        setExpandedTransactionId(expandedTransactionId === transactionId ? null : transactionId);
    };

    const getStatus = (transaction) => {
        if (transaction.operation_status) {
            return transaction.operation_status;
        } else {
            return transaction.fraud_probability > 70 ? "Требует проверки" : "Завершена";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}.${month}.${year} ${hours}:${minutes}`;
    };

    return (
        <div className="transaction-list-container">
            <table className="transaction-list">
                <thead>
                    <tr>
                        <th>Дата и время</th>
                        <th>ID операции</th>
                        <th>User ID -> Recipient ID</th>
                        <th>Сумма операции</th>
                        <th>Статус операции</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => {
                        const status = getStatus(transaction);
                        const isHighFraud = transaction.fraud_probability > 70;
                        const isExpanded = expandedTransactionId === transaction.id;
                        const requiresReview = status === "Требует проверки";

                        return (
                            <React.Fragment key={transaction.id}>
                                {isHighFraud && <div className="fraud-alert">Вероятность мошенничества</div>}
                                <tr
                                    className={isHighFraud ? "fraudulent-transaction" : ""}
                                >
                                    <td data-label="Дата и время">{formatDate(transaction.date)}</td>
                                    <td data-label="ID операции">{transaction.id}</td>
                                    <td data-label="User ID -> Recipient ID">{transaction.user_id} -> {transaction.recipient_id}</td>
                                    <td data-label="Сумма операции">{transaction.amount}</td>
                                    <td data-label="Статус операции">{status}</td>
                                    <td data-label="Действия">
                                        <button className="btn btn-info" onClick={() => handleInfoClick(transaction.id)}>
                                            <FaInfoCircle /> Подробнее
                                        </button>
                                    </td>
                                </tr>
                                {isExpanded && (
                                    <tr>
                                        <td colSpan="6" className="expanded-details">
                                            <div className="details-grid">
                                                <div className="detail-item">
                                                    <span className="detail-label">Market Place ID:</span>
                                                    <span>{transaction.market_place_Id}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Mobile User ID:</span>
                                                    <span>{transaction.mobile_user_id}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Scammer Account:</span>
                                                    <span>{transaction.scammer_acc}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Contact Phone:</span>
                                                    <span>{transaction.contact_phone}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">FIO:</span>
                                                    <span>{transaction.fio}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Address:</span>
                                                    <span>{transaction.address}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-label">Fraud Probability:</span>
                                                    <span>{transaction.fraud_probability.toFixed(2)}</span>
                                                </div>
                                            </div>
                                            {requiresReview && (
                                                <div className="status-actions">
                                                    <button className="btn btn-success" onClick={() => onStatusChange(transaction.id, "Завершена")}>
                                                        <FaCheck /> Проверено
                                                    </button>
                                                    <button className="btn btn-danger" onClick={() => onStatusChange(transaction.id, "Прервана")}>
                                                        <FaTimes /> Прервать
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;
