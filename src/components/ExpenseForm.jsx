import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const PAID_BY_LOV = ["HL", "JY", "ML", "PY", "SH"]; // alphabetical order

export default function ExpenseForm({ onAddExpense }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(""); // store as string while typing
  const [paidBy, setPaidBy] = useState(PAID_BY_LOV[0]);
  const [date, setDate] = useState("");
  const [splitWith, setSplitWith] = useState(
    PAID_BY_LOV.reduce((acc, name) => {
      acc[name] = { checked: false, amount: "" };
      return acc;
    }, {})
  );
  const [error, setError] = useState("");

  const calculateSplitAmounts = (totalAmount, checkedNames) => {
  if (checkedNames.length === 0) return {};

  const rawSplit = totalAmount / checkedNames.length;
  const split = Math.round(rawSplit * 100) / 100;
  const amounts = {};

  checkedNames.forEach((name) => {
    amounts[name] = split;
  });

  // adjust the last person to account for rounding difference
  const sum = Object.values(amounts).reduce((a, b) => a + b, 0);
  const difference = Math.round((totalAmount - sum) * 100) / 100;
  amounts[checkedNames[checkedNames.length - 1]] += difference;

  return amounts;
};

  // Auto-calculate split amounts when amount or checkboxes change
useEffect(() => {
  const checkedNames = Object.keys(splitWith).filter(
    (name) => splitWith[name].checked
  );

  if (checkedNames.length > 0 && amount) {
    const newSplits = calculateSplitAmounts(Number(amount), checkedNames);

    setSplitWith((prev) => {
      const updated = { ...prev };
      checkedNames.forEach((name) => {
        updated[name].amount = newSplits[name].toFixed(2);
      });
      return updated;
    });
  }
}, [amount, splitWith]);

  // Restrict amount input to 2 decimals
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleCheckboxChange = (name) => {
    setSplitWith((prev) => ({
      ...prev,
      [name]: { ...prev[name], checked: !prev[name].checked },
    }));
  };

  const handleSplitAmountChange = (name, value) => {
    // allow up to 2 decimals
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setSplitWith((prev) => ({
        ...prev,
        [name]: { ...prev[name], amount: value },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate split total
    const totalSplit = Object.values(splitWith).reduce(
      (sum, s) => sum + (Number(s.amount) || 0),
      0
    );
    if (Number(amount).toFixed(2) !== totalSplit.toFixed(2)) {
      setError("Split amounts do not match the total amount.");
      return;
    }
    setError("");

    const expenseData = {
      title,
      amount: Number(amount).toFixed(2),
      paidBy,
      date,
      splitWith,
    };

    onAddExpense(expenseData);

    // reset form
    setTitle("");
    setAmount("");
    setPaidBy(PAID_BY_LOV[0]);
    setDate("");
    setSplitWith(
      PAID_BY_LOV.reduce((acc, name) => {
        acc[name] = { checked: false, amount: "" };
        return acc;
      }, {})
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Amount (£)</label>
        <input
          type="text" // text + regex for 2 decimals
          className="form-control"
          value={amount}
          onChange={handleAmountChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Paid By</label>
        <select
          className="form-select"
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
        >
          {PAID_BY_LOV.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Date</label>
        <DatePicker
        selected={date ? new Date(date) : null}
        onChange={(date) => setDate(date.toISOString().split("T")[0])}
        maxDate={new Date()} // no future dates
        className="form-control"
        dateFormat="yyyy-MM-dd"
        placeholderText="Select a date"
        required
      />
    </div>

      <div className="mb-3">
        <label className="form-label">Split With</label>
        {PAID_BY_LOV.map((name) => (
          <div className="d-flex align-items-center mb-1" key={name}>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={splitWith[name].checked}
              onChange={() => handleCheckboxChange(name)}
            />
            <span className="me-2">{name}</span>
            {splitWith[name].checked && (
              <input
                type="text"
                className="form-control"
                value={splitWith[name].amount}
                onChange={(e) => handleSplitAmountChange(name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary">
        Add Expense
      </button>
    </form>
  );
}
