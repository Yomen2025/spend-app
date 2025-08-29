// components/AddPayment.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function AddPayment({ onPaymentAdded }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const people = ["HL", "JY", "ML", "PY", "SH"].sort();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to || !amount || from === to) {
      alert("Please select both people and enter a valid amount.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid positive number for amount.");
      return;
    }

    const payment = {
      from,
      to,
      amount: numericAmount,
      date: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("payments")
      .insert([payment])
      .select(); // return inserted row

    if (error) {
      console.error("Error adding payment:", error);
      alert("Failed to add payment. Check console for details.");
    } else {
      setMessage(`Payment of £${numericAmount.toFixed(2)} from ${from} to ${to} recorded!`);
      setFrom("");
      setTo("");
      setAmount("");
      if (onPaymentAdded) onPaymentAdded(data[0]);
    }
  };

  return (
    <div className="mt-4">
      <h5>Add Payment / Settle Up</h5>
      {message && <p className="text-success">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3 w-25">
          <label className="form-label">From</label>
          <select className="form-select" value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">Select Payer</option>
            {people.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="mb-3 w-25">
          <label className="form-label">To</label>
          <select className="form-select" value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">Select Recipient</option>
            {people.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="mb-3 w-25">
          <label className="form-label">Amount (£)</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Payment</button>
      </form>
    </div>
  );
}
