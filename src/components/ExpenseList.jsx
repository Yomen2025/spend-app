import React from "react";
import { supabase } from "../supabaseClient";

export default function ExpenseList({ items, setExpenses }) {
  if (!items || items.length === 0) {
    return <p>No expenses recorded yet.</p>;
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("expenses").delete().eq("id", id);

    if (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense. See console for details.");
    } else {
      // Update local state
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    }
  };

  return (
    <div>
      <h3>Expenses List</h3>
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
          {items.map((expense) => (
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
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
