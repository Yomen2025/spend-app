import React from "react";

export default function ExpenseList({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return <p className="text-muted">No expenses recorded yet.</p>;
  }

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
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{expense.title}</td>
              <td>£{Number(expense.amount).toFixed(2)}</td>
              <td>{expense.paidBy}</td>
              <td>{new Date(expense.date).toLocaleDateString("en-GB")}</td>
              <td>
                {expense.splitWith ? (
                  <ul className="list-unstyled mb-0">
                    {Object.entries(expense.splitWith)
                      .filter(([_, val]) => val.checked)
                      .map(([name, val]) => (
                        <li key={name}>
                          {name}: £{Number(val.amount).toFixed(2)}
                        </li>
                      ))}
                  </ul>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
