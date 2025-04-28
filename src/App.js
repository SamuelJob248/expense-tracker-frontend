// src/App.js
import React, { useState, useEffect } from 'react'; // Import useEffect
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import SummaryDisplay from './components/SummaryDisplay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define categories here or import from a shared constants file
const CATEGORIES = [
    'Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Others'
];

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // --- Filter State ---
  const [selectedCategory, setSelectedCategory] = useState(''); // '' means All Categories
  const [selectedYear, setSelectedYear] = useState('');     // '' means All Years
  const [selectedMonth, setSelectedMonth] = useState('');   // '' means All Months

  const triggerRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setExpenseToEdit(null);
  };

  const handleEditClick = (expense) => {
    setExpenseToEdit(expense);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setExpenseToEdit(null);
  };

  const handleSaveComplete = () => {
    triggerRefresh();
  };

  // --- Filter Handlers ---
  const handleCategoryChange = (event) => {
      setSelectedCategory(event.target.value);
  };
  const handleYearChange = (event) => {
      setSelectedYear(event.target.value);
  };
  const handleMonthChange = (event) => {
      setSelectedMonth(event.target.value);
  };
  const clearFilters = () => {
      setSelectedCategory('');
      setSelectedYear('');
      setSelectedMonth('');
  };

  // --- Prepare filters object for API ---
  // Only include filters that have a value
  const currentFilters = {};
  if (selectedCategory) currentFilters.category = selectedCategory;
  if (selectedYear) currentFilters.year = selectedYear;
  if (selectedMonth) currentFilters.month = selectedMonth;

  // Trigger refresh whenever filters change
  // Note: This might cause multiple refreshes if filters are passed directly.
  // A more optimized approach might use a dedicated "Apply Filters" button
  // or debounce the changes, but let's start simple.
  useEffect(() => {
      triggerRefresh(); // Refresh list when filters change
  }, [selectedCategory, selectedYear, selectedMonth]);


  return (
    <div className="App">
      <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />

      <h1>Expense Tracker</h1>

      <SummaryDisplay refreshKey={refreshKey} />
      <hr />

      <ExpenseForm
          key={expenseToEdit ? expenseToEdit.id : 'add'}
          expenseToEdit={expenseToEdit}
          onSaveComplete={handleSaveComplete}
          onCancelEdit={handleCancelEdit}
      />
      <hr />

      {/* --- Filter Controls --- */}
      <div className="filters" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc' }}>
          <h3>Filter Expenses</h3>
          <label htmlFor="filterCategory">Category: </label>
          <select id="filterCategory" value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
              ))}
          </select>

          <label htmlFor="filterYear" style={{ marginLeft: '15px' }}>Year: </label>
          <input
              type="number"
              id="filterYear"
              placeholder="YYYY"
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: '80px' }}
          />

          <label htmlFor="filterMonth" style={{ marginLeft: '15px' }}>Month: </label>
          <input
              type="number"
              id="filterMonth"
              placeholder="MM"
              min="1"
              max="12"
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: '60px' }}
          />

          <button onClick={clearFilters} style={{ marginLeft: '15px' }}>Clear Filters</button>
      </div>
      {/* --- End Filter Controls --- */}


      <ExpenseList
          key={refreshKey} // Refresh list on add/delete/update AND filter change
          onDataChange={triggerRefresh} // Needed? Refresh happens via key prop now
          onEditClick={handleEditClick}
          filters={currentFilters} // Pass the current filters down
      />

    </div>
  );
}

export default App;