import React, { useState, useMemo, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Summary({ expenses }) {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [payments, setPayments] = useState([]);

  const people = ["HL", "JY", "ML", "PY", "SH"].sort();

  // Fetch payments from Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase.from("payments").select("*");
      if (error) console.error("Error fetching payments:", error);
      else setPayments(data);
    };
    fetchPayments();
  }, []);

  const parseSplitAmount = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  // Compute total paid by each person (expenses only)
  const totalPaidByPerson = useMemo(() => {
    const totals = {};
    people.forEach((p) => (totals[p] = 0));
    expenses.forEach((exp) => {
      totals[exp.paidBy] += parseFloat(exp.amount);
    });
    return totals;
  }, [expenses]);

  // Compute net balances including payments
  const balances = useMemo(() => {
    const net = {};
    people.forEach((p) => (net[p] = 0));

    // Add expenses
    expenses.forEach((exp) => {
      const paidBy = exp.paidBy;
      if (exp.splitWith) {
        Object.entries(exp.splitWith).forEach(([name, val]) => {
          if (val.checked) {
            const splitAmount = parseSplitAmount(val.amount);
            net[name] -= splitAmount;
            net[paidBy] += splitAmount;
          }
        });
      }
    });

    // Subtract payments
    payments.forEach(({ from, to, amount }) => {
      const amt = parseFloat(amount);
      if (!isNaN(amt)) {
        net[from] += amt; // they already paid, reduce their debt
        net[to] -= amt;   // recipient received, reduce what others owe them
      }
    });

    return net;
  }, [expenses, payments]);

  // Simplify debts logic (same as before)
  const simplifiedDebts = useMemo(() => {
    const debts = [];
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance > 0) creditors.push({ person, amount: balance });
      else if (balance < 0) debtors.push({ person, amount: -balance });
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    let cIndex = 0, dIndex = 0;
    while (cIndex < creditors.length && dIndex < debtors.length) {
      const creditor = creditors[cIndex];
      const debtor = debtors[dIndex];
      const payAmount = Math.min(creditor.amount, debtor.amount);

      debts.push({ from: debtor.person, to: creditor.person, amount: payAmount });

      creditor.amount -= payAmount;
      debtor.amount -= payAmount;

      if (creditor.amount === 0) cIndex++;
      if (debtor.amount === 0) dIndex++;
    }

    return debts;
  }, [balances]);

  const filteredExpenses = selectedPerson
    ? expenses.filter(
        (exp) =>
          exp.paidBy === selectedPerson ||
          (exp.splitWith && exp.splitWith[selectedPerson]?.checked)
      )
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

      {/* Simplify Debt Section */}
      <div className="mt-4">
        <h5>Balances (Simplify Debt)</h5>
        {selectedPerson === "" ? (
          <p>Total expenses for all: £
            {expenses.reduce((acc, e) => acc + parseFloat(e.amount), 0).toFixed(2)}
          </p>
        ) : (
          <div>
            <p>Total paid by {selectedPerson}: £
              {totalPaidByPerson[selectedPerson].toFixed(2)}
            </p>
            <ul className="list-group mt-2">
              {simplifiedDebts
                .filter(d => d.from === selectedPerson || d.to === selectedPerson)
                .map((d, idx) => (
                  <li key={idx} className="list-group-item">
                    {d.from === selectedPerson
                      ? `You owe ${d.to} £${d.amount.toFixed(2)}`
                      : `${d.from} owes you £${d.amount.toFixed(2)}`}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
