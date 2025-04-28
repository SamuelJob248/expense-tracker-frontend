
import React, { useState, useEffect } from 'react';
import { addExpense, updateExpense } from '../services/api';
import { toast } from 'react-toastify'; 

const CATEGORIES = [
  'Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Others'
];

function ExpenseForm({ expenseToEdit, onSaveComplete, onCancelEdit }) {

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState('');


 
  const isEditMode = Boolean(expenseToEdit);

 
  useEffect(() => {
    if (isEditMode) {
      setTitle(expenseToEdit.title);
      setAmount(String(expenseToEdit.amount));
      setDate(expenseToEdit.date);
      setCategory(expenseToEdit.category);
      setNotes(expenseToEdit.notes || '');
    } else {
    
      setTitle('');
      setAmount('');
      setDate('');
      setCategory(CATEGORIES[0]);
      setNotes('');
    }
  }, [expenseToEdit, isEditMode]);


  const handleSubmit = async (event) => {
    event.preventDefault();

    
    if (!title || !amount || !date || !category) {
        toast.error("Please fill in Title, Amount, Date, and Category."); // Use toast
        return;
    }
     const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
         toast.error("Amount must be a positive number."); 
         return;
    }
    
    const expenseData = { title, amount: numericAmount, date, category, notes };

    try {
      let response;
      if (isEditMode) {
        
        response = await updateExpense(expenseToEdit.id, expenseData);
        toast.success(`Expense "${response.data.title}" updated successfully!`); 
      } else {
        
        response = await addExpense(expenseData);
        toast.success(`Expense "${response.data.title}" added successfully!`);
      }
      
      if (onSaveComplete) {
         onSaveComplete();
       }

    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} expense:`, err);
      const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} expense: ${errorMessage}`); 
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>

    

      <div>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="0.01" step="0.01" required />
      </div>
      <div>
        <label htmlFor="date">Date:</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required >
          {CATEGORIES.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
      </div>
      <div>
        <label htmlFor="notes">Notes (Optional):</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <button type="submit">{isEditMode ? 'Update Expense' : 'Add Expense'}</button>
      {isEditMode && (
        <button type="button" onClick={onCancelEdit} style={{ marginLeft: '10px' }}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default ExpenseForm;
