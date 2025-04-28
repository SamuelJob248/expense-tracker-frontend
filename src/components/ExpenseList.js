
import React, { useState, useEffect } from 'react';
import { getExpenses, deleteExpense } from '../services/api';
import { toast } from 'react-toastify'; 
import Spinner from './Spinner';

function ExpenseList({ onDataChange, onEditClick, filters }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getExpenses(filters);
        setExpenses(response.data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError('Failed to fetch expenses. Is the backend server running?');
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();

  }, [filters]); 

  const handleDelete = async (idToDelete) => {
      if (window.confirm('Are you sure you want to delete this expense?')) {
          try {
              await deleteExpense(idToDelete);
              toast.success('Expense deleted successfully!'); 
              if (onDataChange) {
                  onDataChange(); 
              }
          } catch (err) {
              console.error("Error deleting expense:", err);
              toast.error(`Failed to delete expense. Please try again.`); 
          }
      }
  };

 
  if (loading) return <Spinner />;;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
      <div>
          <h2>Expenses</h2>
          {/* Removed deleteError p tag */}
          {expenses.length === 0 ? (
              <p>No expenses found matching the current filters.</p>
          ) : (
              <ul>
                  {expenses.map((expense) => (
                      <li key={expense.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span>
                              {expense.date} - {expense.title} ({expense.category}): ₹{expense.amount}
                          </span>
                          <button onClick={() => onEditClick(expense)}>Edit</button>
                          <button onClick={() => handleDelete(expense.id)}>Delete</button>
                      </li>
                  ))}
              </ul>
          )}
      </div>
  );
}

export default ExpenseList;
