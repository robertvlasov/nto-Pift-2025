
import React, { useState } from 'react';
import './TransactionList.css';

const TransactionList = ({ transactions, onDelete, onUpdate }) => {
    const [editingTransactionId, setEditingTransactionId] = useState(null);
    const [editedTransaction, setEditedTransaction] = useState({});

    const handleEdit = (transaction) => {
        setEditingTransactionId(transaction.id);
        setEditedTransaction({ ...transaction });
    };

    const handleCancelEdit = () => {
        setEditingTransactionId(null);
        setEditedTransaction({});
    };

    const handleSaveEdit = () => {
        onUpdate({ ...editedTransaction, date: new Date(editedTransaction.date).toISOString() });
        setEditingTransactionId(null);
        setEditedTransaction({});
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTransaction(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const paddedTransactions = [...transactions];
    while (paddedTransactions.length < 5) {
        paddedTransactions.push({});
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <div className="transaction-list-container">
            <table className="transaction-list">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Описание</th>
                        <th>User ID</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {paddedTransactions.map((transaction, index) => (
                        <tr key={index}>
                            {transaction.id ? (
                                <>
                                    <td data-label="ID">{transaction.id}</td>
                                    <td data-label="Дата">
                                        {editingTransactionId === transaction.id ? (
                                            <input
                                                type="datetime-local"
                                                name="date"
                                                value={new Date(editedTransaction.date).toISOString().slice(0, 16)}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            formatDate(transaction.date)
                                        )}
                                    </td>
                                    <td data-label="Сумма">
                                        {editingTransactionId === transaction.id ? (
                                            <input
                                                type="number"
                                                name="amount"
                                                value={editedTransaction.amount}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            transaction.amount
                                        )}
                                    </td>
                                    <td data-label="Описание">
                                        {editingTransactionId === transaction.id ? (
                                            <input
                                                type="text"
                                                name="description"
                                                value={editedTransaction.description}
                                                onChange={handleChange}
                                            />
                                        ) : (
                                            transaction.description
                                        )}
                                    </td>
                                    <td data-label="User ID">{transaction.userId}</td>
                                    <td data-label="Действия">
                                        {editingTransactionId === transaction.id ? (
                                            <>
                                                <button className="btn btn-save" onClick={handleSaveEdit}>Сохранить</button>
                                                <button className="btn btn-cancel" onClick={handleCancelEdit}>Отмена</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="btn btn-edit" onClick={() => handleEdit(transaction)}>Изменить</button>
                                                <button className="btn btn-delete" onClick={() => onDelete(transaction.id)}>Удалить</button>
                                            </>
                                        )}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionList;
