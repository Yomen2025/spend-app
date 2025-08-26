// components/Summary.jsx
import React, { useState } from "react";

export default function Summary({ expenses }) {
  const [selectedPerson, setSelectedPerson] = useState("");

  // List of people, alphabetically sorted
  const people = ["HL", "JY", "ML", "PY", "SH"].sort();

  // Filter expenses by selected person (if any)
  const filteredExpenses = selectedPerson
    ? expenses.filter((exp) => exp.paidBy === selectedPerson || (exp.splitWith && exp.splitWith[selectedPerson] > 0))
    : expenses;

  return (
    <div>
      <h3>Summary</h3>
      <div className="mb-3 w-25">
        <label className="form-label">Select Person</label>
        <select
          className="form-select"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
        >
          <option value="">All</option>
          {people.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <p className="text-muted mt-3">
        Total expenses for {selectedPerson || "all"} will go here.
      </p>

      <ul className="list-group mt-2">
        {filteredExpenses.map((expense, index) => (
          <li key={index} className="list-group-item">
            {expense.title} - £{expense.amount} - Paid by: {expense.paidBy} - Date:{" "}
            {new Date(expense.date).toLocaleDateString("en-GB")}
          </li>
        ))}
      </ul>
    </div>
  );
}
