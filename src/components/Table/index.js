import React from "react";
import "./index.css";

function Table({ countriesData }) {
  return (
    <div className="table">
      {countriesData.map((c) => (
        <tr>
          <td>{c.country}</td>
          <td>
            <strong>{c.cases}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
