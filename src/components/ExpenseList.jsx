import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ExpenseList({ items, setExpenses }) {
  const [payments, setPayments] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");

  // Fetch payments from Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase.from("payments").select("*");
      if (error) {
        console.error("Error fetching payments:", error);
      } else {
        setPayments(data || []);
      }
    };
    fetchPayments();
  }, []);

  // Delete expense
  const handleDeleteExpense = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. See console for details.");
    } else {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    }
  };

  // Delete payment
  const handleDeletePayment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting payment:", error);
      alert("Failed to delete payment. See console for details.");
    } else {
      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    }
  };

  // Get list of all unique people (from expenses + payments)
  const people = [
    ...new Set([
      ...items.map((exp) => exp.paidBy),
      ...payments.map((p) => p.from),
      ...payments.map((p) => p.to),
    ]),
  ].filter(Boolean);

  // Filtered expenses
  const filteredExpenses = selectedPerson
    ? items.filter(
        (expense) =>
          expense.paidBy === selectedPerson ||
          (expense.splitWith &&
            Object.keys(expense.splitWith).includes(selectedPerson))
      )
    : items;

  // Filtered payments
  const filteredPayments = selectedPerson
    ? payments.filter(
        (payment) => payment.from === selectedPerson || payment.to === selectedPerson
      )
    : payments;

  return (
    <div>
      <h3>Ledger</h3>

      {/* Filter */}
      <div className="mb-3">
        <label htmlFor="personFilter" className="form-label">
          Filter by person:
        </label>
        <select
          id="personFilter"
          className="form-select"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
        >
          <option value="">All</option>
          {people.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
      </div>

      {/* Payments List */}
      <h5>Payments List</h5>
      {filteredPayments.length === 0 ? (
        <p>No payments recorded yet.</p>
      ) : (
        <table className="table table-striped table-bordered mb-4">
          <thead className="table-secondary">
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Amount (£)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.from}</td>
                <td>{payment.to}</td>
                <td>{payment.date}</td>
                <td>{payment.amount}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeletePayment(payment.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Expenses List */}
      <h5>Expenses List</h5>
      {filteredExpenses.length === 0 ? (
        <p>No expenses recorded yet.</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Amount (£)</th>
              <th>Paid By</th>
              <th>Date</th>
              <th>Split With</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.title}</td>
                <td>{expense.amount}</td>
                <td>{expense.paidBy}</td>
                <td>{expense.date}</td>
                <td>
                  {expense.splitWith
                    ? Object.entries(expense.splitWith)
                        .filter(([_, val]) => val.checked)
                        .map(([name, val]) => `${name}: £${val.amount}`)
                        .join(", ")
                    : "-"}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
