import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function BarChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const data = {
    labels: [
      "2016 - 2017",
      "2017 - 2018",
      "2018 - 2019",
      "2019 - 2020",
      "2020 - 2021",
      "2021 - 2022",
      "2022 - 2023",
      "2023 - 2024",
    ],
    datasets: [
      {
        label: "1st Sem",
        data: [18178, 16616, 16669, 16061, 15308, 16796, 15679, 14796],
        backgroundColor: "rgba(53, 162, 235, 1)", // Changed color to match the original
      },
      {
        label: "2nd Sem",
        data: [13586, 12049, 11837, 11384, 11510, 13728, 12700],
        backgroundColor: "rgba(255, 99, 132, 1)", // Changed color to match the original
      },
    ],
  };

  return (
    <TitleCard title={""} topMargin="mt-2">
      <Bar options={options} data={data} />
    </TitleCard>
  );
}

export default BarChart;
