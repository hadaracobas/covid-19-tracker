import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, CardContent } from "@material-ui/core";
import axios from "axios";

// import components and files
import Header from "./components/Header";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData } from "./util";

// end point fetch countries: https://disease.sh/v3/covid-19/all
// end point fetch countries: https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  // fetch to display worldwide data by default
  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/all").then((res) => {
      setCountryInfo(res.data);
    });
  }, []);

  // fetch to map all countries --> dropdown menu, table
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

          const sortedData = sortData(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  // fetch when user change country data
  const onChangeCountry = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await axios.get(url).then((res) => {
      setCountryInfo(res.data);
    });
  };

  return (
    <div className="app">
      <div className="app__leftContainer">
        <Header
          country={country}
          countries={countries}
          onChangeCountryMethod={onChangeCountry}
        />

        <div className="app__stats">
          <InfoBox
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        <Map />
      </div>
      <Card className="app__rightContainer">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countriesData={tableData} />
          <h3>Worldwide new Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
