import React, { useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary.jsx";

function App() {
  const [activeTab, setActiveTab] = useState("summary");
  const [expenses, setExpenses] = useState([]); // ✅ always an array
 

  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => [
      ...prevExpenses,
      { ...expense, id: Math.random().toString() },
    ]);
  };

   return (
    <div className="container my-4">
      <h1 className="text-center mb-4 text-primary">
        <i className="bi bi-wallet2 me-2"></i>
        Expense Tracker
      </h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            Summary
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "add" ? "active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            Add Expense
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "list" && <ExpenseList expenses={expenses} />}`}
            onClick={() => setActiveTab("list")}
          >
            List Expenses
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === "summary" && <Summary expenses={expenses} />}
      {activeTab === "add" && <ExpenseForm onAddExpense={addExpenseHandler} />}
      {activeTab === "list" && <ExpenseList items={expenses} />}
    </div>
  );
}

export default App;