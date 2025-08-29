import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Balances() {
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Get expenses
      const { data: expenses, error: expError } = await supabase
        .from("expenses")
        .select("*");

      if (expError) {
        console.error("Error fetching expenses:", expError);
        setLoading(false);
        return;
      }

      // 2. Get payments
      const { data: payments, error: payError } = await supabase
        .from("payments")
        .select("*");

      if (payError) {
        console.error("Error fetching payments:", payError);
        setLoading(false);
        return;
      }

      // 3. Calculate balances
      const tempBalances = {};

      // Handle expenses
      expenses.forEach((expense) => {
        const total = expense.amount;
        const splitWith = expense.splitWith || {};
        const participants = Object.entries(splitWith).filter(
          ([, val]) => val.checked
        );

        const numParticipants = participants.length + 1; // include payer
        const share = total / numParticipants;

        // Payer balance
        tempBalances[expense.paidBy] =
          (tempBalances[expense.paidBy] || 0) + (total - share);

        // Each participant balance
        participants.forEach(([name]) => {
          tempBalances[name] = (tempBalances[name] || 0) - share;
        });
      });

      // Handle payments
      payments.forEach((payment) => {
        tempBalances[payment.payer] =
          (tempBalances[payment.payer] || 0) - payment.amount;
        tempBalances[payment.payee] =
          (tempBalances[payment.payee] || 0) + payment.amount;
      });

      setBalances(tempBalances);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading balances...</p>;

  return (
    <div>
      <h3>Balances</h3>
      {Object.keys(balances).length === 0 ? (
        <p>No balances yet.</p>
      ) : (
        <ul>
          {Object.entries(balances).map(([person, amount]) => (
            <li key={person}>
              {person} {amount >= 0 ? "is owed" : "owes"} £{Math.abs(amount)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
