
import React, { useState, useEffect } from 'react'; 
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import SummaryDisplay from './components/SummaryDisplay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CATEGORIES = [
    'Food', 'Rent', 'Utilities', 'Entertainment', 'Travel', 'Shopping', 'Others'
];

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [expenseToEdit, setExpenseToEdit] = useState(null);


  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');     
  const [selectedMonth, setSelectedMonth] = useState('');   

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


  const currentFilters = {};
  if (selectedCategory) currentFilters.category = selectedCategory;
  if (selectedYear) currentFilters.year = selectedYear;
  if (selectedMonth) currentFilters.month = selectedMonth;


  useEffect(() => {
      triggerRefresh(); 
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
          key={refreshKey} 
          onDataChange={triggerRefresh} 
          onEditClick={handleEditClick}
          filters={currentFilters} 
      />

    </div>
  );
}

export default App;
