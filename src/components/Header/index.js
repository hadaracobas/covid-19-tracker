import React, { useState, useEffect } from "react";
import "./index.css";
import { FormControl, Select, MenuItem } from "@material-ui/core";
import axios from "axios";

// end point fetch countries: https://disease.sh/v3/covid-19/countries

function Header() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  useEffect(() => {
    const getCountriesData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/countries")
        .then((res) => {
          const data = res.data;
          const countries = data.map((c) => ({
            name: c.country,
            value: c.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);

  const onChangeCountry = (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
  };

  return (
    <header className="app__header">
      <h1>COVID 19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" value={country} onChange={onChangeCountry}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </header>
  );
}

export default Header;
