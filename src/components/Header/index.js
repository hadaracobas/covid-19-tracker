import React from "react";
import "./index.css";
import { FormControl, Select, MenuItem } from "@material-ui/core";

function Header(props) {
  return (
    <header className="app__header">
      <h1>COVID 19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select
          variant="outlined"
          value={props.country}
          onChange={props.onChangeCountryMethod}
        >
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {props.countries.map((c, index) => (
            <MenuItem key={index} value={c.value}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </header>
  );
}

export default Header;
