import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ runningProjectsCount, completedProjectsCount }) => {
  const pieChartData = {
    labels: ["New Projects", "Active Projects", "Completed Projects"],
    datasets: [
      {
        data: [
          runningProjectsCount + completedProjectsCount,
          runningProjectsCount,
          completedProjectsCount,
        ],
        backgroundColor: ["#005182", "#0b1338", "#faa31f"],
      },
    ],
  };

  const pieChartOptions = {
    title: {
      display: true,
      text: "My Pie Chart",
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#0b1338",
          font: {
            size: 14,
            weight: 500,
          },
        },
      },
    },
  };

  return (
    <div>
      <Pie data={pieChartData} options={pieChartOptions} />
    </div>
  );
};

export default PieChart;
