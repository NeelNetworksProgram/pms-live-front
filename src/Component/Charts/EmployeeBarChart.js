import React, { useContext } from "react";
import { ContextTheme } from "../../Context/ThemeContext";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const EmployeeBarChart = () => {
  const { toggleTheme } = useContext(ContextTheme);
  const data = {
    labels: ["Jan", "Feb", "Mar"], // on x axis
    datasets: [
      {
        label: "Projects Received", // this for heading
        data: [35, 45, 55], // on y axis
        backgroundColor: "#faa31f",
      },
      {
        label: "Projects Finished on Time", // this for heading
        data: [25, 35, 25], // on y axis
        backgroundColor: "#33421B",
        //  "#0b1338",
      },
      {
        label: "Projects I could not finish on Time", // this for heading
        data: [10, 10, 30], // on y axis
        backgroundColor: "#005182",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          padding: 7,
          color: toggleTheme ? "#fff" : "#000",
          font: {
            size: 14,
            family: "Inter, sans-serif",
            weight: toggleTheme ? "500" : "600",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label} in ${context.label}: ${context.formattedValue}`;
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: toggleTheme ? "#fff" : "#000",
          font: {
            weight: "500",
            size: 14,
          },
        },
      },
      x: {
        ticks: {
          color: toggleTheme ? "#fff" : "#000",
          font: {
            weight: "500",
            size: 15,
          },
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options}></Bar>
    </div>
  );
};

export default EmployeeBarChart;
