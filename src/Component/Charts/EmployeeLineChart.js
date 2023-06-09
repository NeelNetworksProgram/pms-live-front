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

const EmployeeLineChart = () => {
  const data = {
    labels: ["Ferndale", "Google", "Tata Motorworks", "Zapak"],
    datasets: [
      {
        label: "Time Entries (in hrs)",
        data: [7, 8.5, 9, 6.9],
        pointBackgroundColor: "rgb(250 163 31)",
        borderColor: "#0b1338",
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const options = {
    plugins: {
      legend: true,
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default EmployeeLineChart;
