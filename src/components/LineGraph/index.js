import React, { useState, useEffect } from "react";
import "./index.css";
import { Line } from "react-chartjs-2";
import axios from "axios";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRadio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  const buildChartData = (theData, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;

    for (let date in theData.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: theData[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = theData[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => {
          const chartData = buildChartData(res.data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
