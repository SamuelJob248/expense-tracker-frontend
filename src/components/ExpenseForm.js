// src/components/ExpenseForm.js
import React, { useState, useEffect } from 'react';
import { addExpense, updateExpense } from '../services/api';
import { toast } from 'react-toastify'; // <-- Import toast

const CATEGORIES = [
  'Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Others'
];

// Accept expenseToEdit, onSaveComplete, onCancelEdit props from App.js
function ExpenseForm({ expenseToEdit, onSaveComplete, onCancelEdit }) {
  // State for form fields
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState('');
  // Removed error/success state variables

  // Determine if the form is in edit mode
  const isEditMode = Boolean(expenseToEdit);

  // useEffect to populate form when expenseToEdit changes
  useEffect(() => {
    if (isEditMode) {
      setTitle(expenseToEdit.title);
      setAmount(String(expenseToEdit.amount));
      setDate(expenseToEdit.date);
      setCategory(expenseToEdit.category);
      setNotes(expenseToEdit.notes || '');
    } else {
      // Clear form for Add mode
      setTitle('');
      setAmount('');
      setDate('');
      setCategory(CATEGORIES[0]);
      setNotes('');
    }
  }, [expenseToEdit, isEditMode]);

  // --- Form Submission Handler (Handles both Add and Update) ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!title || !amount || !date || !category) {
        toast.error("Please fill in Title, Amount, Date, and Category."); // Use toast
        return;
    }
     const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
         toast.error("Amount must be a positive number."); // Use toast
         return;
    }
    // Prepare data (ensure amount is number)
    const expenseData = { title, amount: numericAmount, date, category, notes };

    try {
      let response;
      if (isEditMode) {
        // --- Update existing expense ---
        response = await updateExpense(expenseToEdit.id, expenseData);
        toast.success(`Expense "${response.data.title}" updated successfully!`); // Use toast
      } else {
        // --- Add new expense ---
        response = await addExpense(expenseData);
        toast.success(`Expense "${response.data.title}" added successfully!`); // Use toast
      }
      // Call the callback from App.js to trigger refresh and clear edit state
      if (onSaveComplete) {
         onSaveComplete();
       }

    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} expense:`, err);
      const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      toast.error(`Failed to ${isEditMode ? 'update' : 'add'} expense: ${errorMessage}`); // Use toast
    }
  };

  // --- JSX for the form ---
  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>

      {/* Removed error/success p tags */}

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