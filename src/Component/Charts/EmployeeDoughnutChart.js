import React, { useContext } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from "chart.js";
import { ContextTheme } from "../../Context/ThemeContext";

ChartJS.register(Tooltip, Legend, ArcElement);

export const EmployeeDoughnutChart = () => {
  const { toggleTheme } = useContext(ContextTheme);
  const data = {
    labels: ["Active Project", "Project On Halt", "Completed Projects"],
    datasets: [
      {
        label: "Poll",
        data: [5, 1, 2],
        backgroundColor: ["#005182", "#9F1C20", "#faa31f"],
        borderColor: ["transparent"],
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        labels: {
          color: toggleTheme ? "#fff" : "#000",
          font: {
            size: 13,
            family: "Inter, sans-serif",
            weight: toggleTheme ? "500" : "600",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.label}: ${context.parsed}`;
          },
        },
      },
    },
  };

  return <Doughnut options={options} data={data} />;
};
