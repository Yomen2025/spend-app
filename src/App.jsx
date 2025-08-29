// src/App.jsx
import React, { useState, useEffect } from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import Summary from "./components/Summary.jsx";
import AddPayment from "./components/AddPayment.jsx";
import { supabase } from "./supabaseClient";

function App() {
  const [activeTab, setActiveTab] = useState("summary");
  const [expenses, setExpenses] = useState([]);
  const [payments, setPayments] = useState([]);

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

  // Fetch payments from Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data);
      }
    };

    fetchPayments();
  }, []);

  // Add expense
  const addExpenseHandler = async (expense) => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([expense])
      .select();

    if (error) {
      console.error("Error adding expense:", error);
    } else if (data && data.length > 0) {
      setExpenses((prev) => [...prev, data[0]]);
    }
  };

  // Add payment
  const addPaymentHandler = async (payment) => {
    const { data, error } = await supabase
      .from("payments")
      .insert([payment])
      .select();

    if (error) {
      console.error("Error adding payment:", error);
    } else if (data && data.length > 0) {
      setPayments((prev) => [...prev, data[0]]);
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
            className={`nav-link ${activeTab === "payment" ? "active" : ""}`}
            onClick={() => setActiveTab("payment")}
          >
            Add Payment
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
      {activeTab === "summary" && (
        <Summary expenses={expenses} payments={payments} />
      )}
      {activeTab === "add" && <ExpenseForm onAddExpense={addExpenseHandler} />}
      {activeTab === "payment" && (
        <AddPayment onAddPayment={addPaymentHandler} />
      )}
      {activeTab === "list" && (
        <ExpenseList items={expenses} setExpenses={setExpenses} />
      )}
    </div>
  );
}

export default App;
