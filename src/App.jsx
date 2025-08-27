import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary.jsx";
import { supabase } from "./supabaseClient";

function App() {
  const [activeTab, setActiveTab] = useState("summary");
  const [expenses, setExpenses] = useState([]); // ✅ always an array

  // Fetch expenses from Supabase
  useEffect(() => {
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        setExpenses(data);
      }
    };

    fetchExpenses();
  }, []);

  const addExpenseHandler = async (expense) => {
    // Save to Supabase
    const { data, error } = await supabase
      .from("expenses")
      .insert([expense])
      .select(); // <-- this ensures the inserted row is returned

    if (error) {
      console.error("Error adding expense:", error);
    } else if (data && data.length > 0) {
      // Update local state safely
      setExpenses((prev) => [...prev, data[0]]);
    }
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
            className={`nav-link ${activeTab === "list" ? "active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            List Expenses
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === "summary" && <Summary expenses={expenses} />}
      {activeTab === "add" && <ExpenseForm onAddExpense={addExpenseHandler} />}
      {activeTab === "list" && <ExpenseList expenses={expenses} />}
    </div>
  );
}

export default App;
