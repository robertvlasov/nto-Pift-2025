import React, { useState, useEffect } from 'react';
import './EditTransactionModal.css';

const EditTransactionModal = ({ transaction, onClose, onSave }) => {
    const [date, setDate] = useState(transaction.date);
    const [amount, setAmount] = useState(transaction.amount);
    const [description, setDescription] = useState(transaction.description);
    const [status, setStatus] = useState(transaction.status);


    useEffect(() => {
        if (transaction) {
            setDate(transaction.date);
            setAmount(transaction.amount);
            setDescription(transaction.description);
            setStatus(transaction.status);
        }
    }, [transaction]);


    const handleSave = () => {
        const updatedTransaction = {
            ...transaction,
            date: date,
            amount: amount,
            description: description,
            status: status,
        };

        onSave(updatedTransaction);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Редактировать транзакцию</h2>
                <div className="form-group">
                    <label htmlFor="date">Дата:</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Сумма:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Описание:</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Статус:</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="completed">Завершен</option>
                        <option value="pending">В ожидании</option>
                        <option value="failed">Отменен</option>
                    </select>
                </div>
                <button className="btn btn-save" onClick={handleSave}>Сохранить</button>
            </div>
        </div>
    );
};

export default EditTransactionModal;
