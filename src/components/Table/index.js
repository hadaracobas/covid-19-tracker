import React from "react";
import "./index.css";
import numeral from "numeral";

function Table({ countriesData }) {
  return (
    <div className="table">
      {countriesData.map((c, index) => (
        <tr key={index}>
          <td>{c.country}</td>
          <td>
            <strong>{numeral(c.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
