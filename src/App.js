import React, { useState, useEffect } from "react";
import "./App.css";
import { Card, CardContent } from "@material-ui/core";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// import components and files
import Header from "./components/Header";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import LineGraph from "./components/LineGraph";
import { sortData } from "./util";
import { prettyPrintStat } from "./util";

// end point fetch countries: https://disease.sh/v3/covid-19/all
// end point fetch countries: https://disease.sh/v3/covid-19/countries

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  // fetch when user change country data
  const onChangeCountry = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await axios.get(url).then((res) => {
      setCountry(countryCode);
      setCountryInfo(res.data);

      if (countryCode === "worldwide") {
        setMapCenter({ lat: 34.80746, lng: -40.4796 });
      } else {
        setMapCenter({
          lat: res.data.countryInfo.lat,
          lng: res.data.countryInfo.long,
        });
      }
      setMapZoom(4);
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
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
        />
      </div>
      <Card className="app__rightContainer">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countriesData={tableData} />
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
