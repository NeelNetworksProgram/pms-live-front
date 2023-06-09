import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend);

const LineChart = ({ runningProjectsData }) => {
  const projectNames = runningProjectsData.map((ele) => ele.name);
  const projectStage = runningProjectsData.map((ele) =>
    Number(ele.project_stage)
  );

  const data = {
    labels: projectNames.map((ele) => ele),
    datasets: [
      {
        label: "Project Progress Line chart",
        data: projectStage.map((ele) => ele),
        pointBackgroundColor: "rgb(250 163 31)",
        borderColor: "#0b1338",
        fill: true,
        tension: 0.5,
      },
    ],
  };
  const options = {
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
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
