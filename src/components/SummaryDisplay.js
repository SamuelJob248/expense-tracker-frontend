// src/components/SummaryDisplay.js
import React, { useState, useEffect } from 'react';
import { getSummary } from '../services/api'; // Import the getSummary API function
import Spinner from './Spinner';
// Accept refreshKey as a prop to trigger re-fetching
function SummaryDisplay({ refreshKey }) {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSummary(); // Call the API function
        setSummaryData(response.data);
      } catch (err) {
        console.error("Error fetching summary:", err);
        setError("Failed to fetch summary data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    // Add refreshKey as a dependency. When it changes, useEffect runs again.
  }, [refreshKey]);

  // --- Render Logic ---

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Ensure summaryData is not null before trying to access its properties
  if (!summaryData) {
      return <p>No summary data available.</p>;
  }

  return (
    <div>
      <h2>Summary</h2>
      {/* Display Total Spent */}
      <p>
        <strong>Total Spent:</strong> ₹{parseFloat(summaryData.total_spent || 0).toFixed(2)}
      </p>

      {/* Display Category Breakdown */}
      <h3>Category Summary:</h3>
      {Object.keys(summaryData.category_summary).length === 0 ? (
        <p>No spending by category yet.</p>
      ) : (
        <ul>
          {/* Map over the category_summary object */}
          {Object.entries(summaryData.category_summary).map(([category, total]) => (
            <li key={category}>
              {category}: ₹{parseFloat(total || 0).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SummaryDisplay;