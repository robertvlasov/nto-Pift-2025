
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
    const [sortBy, setSortBy] = useState('amount');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;
    const [showOnlyRequiresReview, setShowOnlyRequiresReview] = useState(false);


    useEffect(() => {
        const initialTransactions = Array.from({ length: 15 }, (_, i) => {
            const fraudProbability = Math.random() * 100;
            const transactionDate = new Date();
            return {
                market_place_Id: `MP${Math.floor(Math.random() * 10) + 1}`,
                mobile_user_id: `MU${Math.floor(Math.random() * 100) + 1}`,
                scammer_acc: `ACC${Math.floor(Math.random() * 1000) + 1}`,
                contact_phone: `+7${Math.floor(Math.random() * 900000000) + 7000000000}`,
                fio: `User ${i + 1} FIO`,
                address: `Address ${i + 1}`,
                fraud_probability: fraudProbability,
                id: i + 1,
                user_id: Math.floor(Math.random() * 5) + 1,
                recipient_id: Math.floor(Math.random() * 5) + 6,
                amount: Math.floor(Math.random() * 200) + 50,
                operation_status: null,
                date: transactionDate.toISOString(),
            };
        });
        setTransactions(initialTransactions);
    }, []);


    const getStatus = (transaction) => {
        if (transaction.operation_status) {
            return transaction.operation_status;
        } else {
            return transaction.fraud_probability > 70 ? "Требует проверки" : "Завершена";
        }
    };

    const formatDateForSearch = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };


    const filteredTransactions = transactions.filter((transaction) => {
        const searchDate = formatDateForSearch(transaction.date);
        return (
            String(transaction.user_id).includes(searchTerm) ||
            String(transaction.recipient_id).includes(searchTerm) ||
            searchDate.includes(searchTerm) ||
            searchTerm === ''
        ) &&
        (!showOnlyRequiresReview || getStatus(transaction) === "Требует проверки");
    });


    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        switch (sortBy) {
            case 'amount':
                return order * (a.amount - b.amount);
            case 'date':
                return order * (new Date(a.date) - new Date(b.date));
            case 'id':
                return order * (a.id - b.id);
            default:
                return 0;
        }
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
        acc[transaction.user_id] = (acc[transaction.user_id] || 0) + 1;
        return acc;
    }, {});

    const userTransactionData = Object.entries(userTransactionCounts).map(([userId, count]) => ({
        userId: `User ${userId}`,
        transactions: count,
    }));

    const totalAmountsByUserId = transactions.reduce((acc, transaction) => {
        acc[transaction.user_id] = (acc[transaction.user_id] || 0) + transaction.amount;
        return acc;
    }, {});

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#800080'];

    const pieChartData = Object.entries(totalAmountsByUserId).map(([userId, totalAmount]) => ({
        name: `User ${userId}`,
        value: totalAmount,
    }));

    const handleStatusChange = (transactionId, newStatus) => {
        setTransactions(prevTransactions =>
            prevTransactions.map(transaction => {
                if (transaction.id === transactionId) {
                    return { ...transaction, operation_status: newStatus, fraud_probability: 0 };
                } else {
                    return transaction;
                }
            })
        );
    };
    return (
        <div className="admin-page-container">
            <div className="admin-page">
                <button className="btn btn-logout" onClick={onLogout}>Выйти</button>
                <h2>Панель управления</h2>


                <div className="filters">
                    <input
                        type="text"
                        placeholder="Поиск по User ID, Recipient ID или дате"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="sort-options">
                        <label htmlFor="sortBy">Сортировать по:</label>
                        <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                            <option value="amount">Сумма</option>
                            <option value="date">Дата и время</option>
                            <option value="id">ID операции</option>
                        </select>
                        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="sort-order-select">
                            <option value="asc">По возрастанию</option>
                            <option value="desc">По убыванию</option>
                        </select>
                    </div>
                    <div className="requires-review-filter">
                        <label htmlFor="showOnlyRequiresReview" className="requires-review-label">
                            <input
                                type="checkbox"
                                id="showOnlyRequiresReview"
                                checked={showOnlyRequiresReview}
                                onChange={(e) => setShowOnlyRequiresReview(e.target.checked)}
                                className="requires-review-checkbox"
                            />
                            Показать только требующие проверки
                        </label>
                    </div>
                </div>



                <TransactionList
                    transactions={currentTransactions}
                    onStatusChange={handleStatusChange}
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
