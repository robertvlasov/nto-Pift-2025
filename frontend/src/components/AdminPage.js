
import React, { useState, useEffect } from 'react';
import TransactionList from './TransactionList';
import './AdminPage.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';

const AdminPage = ({ onLogout }) => {
    const [transactions, setTransactions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;
    const [newTransaction, setNewTransaction] = useState({
        date: new Date().toISOString().slice(0, 16),
        amount: '',
        description: '',
        userId: '',
    });

    useEffect(() => {
        const initialTransactions = Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: Math.floor(Math.random() * 200) + 50,
            description: `Payment ${i + 1}`,
            userId: Math.floor(Math.random() * 5) + 1,
        }));
        setTransactions(initialTransactions);
    }, []);

    const handleDeleteTransaction = (id) => {
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
    };

    const handleUpdateTransaction = (updatedTransaction) => {
        setTransactions(
            transactions.map((transaction) =>
                transaction.id === updatedTransaction.id ? updatedTransaction : transaction
            )
        );
    };

    const handleCreateTransaction = () => {
        if (!newTransaction.amount || !newTransaction.description || !newTransaction.userId) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }

        const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        const transactionToAdd = {
            id: newId,
            date: new Date(newTransaction.date).toISOString(),
            amount: parseFloat(newTransaction.amount),
            description: newTransaction.description,
            userId: parseInt(newTransaction.userId),
        };

        setTransactions([...transactions, transactionToAdd]);
        setNewTransaction({
            date: new Date().toISOString().slice(0, 16),
            amount: '',
            description: '',
            userId: '',
        });
    };

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(transaction.date).toLocaleDateString().includes(searchTerm)
    );

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'date') {
            return order * (new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'amount') {
            return order * (a.amount - b.amount);
        }
        return 0;
    });

    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    const currentTransactions = sortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
    const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleGoToPage = (page) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const userTransactionCounts = transactions.reduce((acc, transaction) => {
        acc[transaction.userId] = (acc[transaction.userId] || 0) + 1;
        return acc;
    }, {});

    const userTransactionData = Object.entries(userTransactionCounts).map(([userId, count]) => ({
        userId: `User ${userId}`,
        transactions: count,
    }));

    const totalAmountsByUserId = transactions.reduce((acc, transaction) => {
        acc[transaction.userId] = (acc[transaction.userId] || 0) + transaction.amount;
        return acc;
    }, {});

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#800080'];

    const pieChartData = Object.entries(totalAmountsByUserId).map(([userId, totalAmount]) => ({
        name: `User ${userId}`,
        value: totalAmount,
    }));

    return (
        <div className="admin-page-container">
            <div className="admin-page">
                <button className="btn btn-logout" onClick={onLogout}>Выйти</button>
                <h2>Панель управления</h2>


                <h3>Записать новую транзакцию</h3>
                <div className="add-transaction-form">
                    <input
                        type="datetime-local"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                        className="new-transaction-input"
                    />
                    <input
                        type="number"
                        placeholder="Сумма"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                        className="new-transaction-input"
                    />
                    <input
                        type="text"
                        placeholder="Описание"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                        className="new-transaction-input"
                    />
                    <input
                        type="number"
                        placeholder="User ID"
                        value={newTransaction.userId}
                        onChange={(e) => setNewTransaction({ ...newTransaction, userId: e.target.value })}
                        className="new-transaction-input"
                    />
                    <button className="btn btn-add" onClick={handleCreateTransaction}>Добавить</button>
                </div>


                <div className="filters">
                    <input
                        type="text"
                        placeholder="Поиск по описанию, дате или user id"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="sort-options">
                        <label htmlFor="sortBy">Сортировать по:</label>
                        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="date">Дата</option>
                            <option value="amount">Сумма</option>
                        </select>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="asc">По возрастанию</option>
                            <option value="desc">По убыванию</option>
                        </select>
                    </div>
                </div>



                <TransactionList
                    transactions={currentTransactions}
                    onDelete={handleDeleteTransaction}
                    onUpdate={handleUpdateTransaction}
                />

                <div className="pagination">
                    <button className="btn btn-pagination" onClick={handlePrevPage} disabled={currentPage === 1}>Предыдущая</button>
                    <button className="btn btn-pagination" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>Следующая</button>
                    <div className="page-number-input">
                        <input
                            type="number"
                            value={currentPage}
                            onChange={(e) => handleGoToPage(Number(e.target.value))}
                            min="1"
                            max={totalPages}
                        />
                        <span>/ {totalPages}</span>
                    </div>
                </div>

                <div className="charts-container">
                    <div className="chart">
                        <h3>Количество транзакций по пользователям</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userTransactionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="userId" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="transactions" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart">
                        <h3>Сумма транзакций по пользователям</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    isAnimationActive={false}
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {
                                        pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))
                                    }
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;



