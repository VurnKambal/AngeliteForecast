import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import TitleCard from "../../../components/Cards/TitleCard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

function LineChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = [
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
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
        fill: true,
        label: "1st Sem",
        data: [18178, 16616, 16669, 16061, 15308, 16796, 15679, 14796],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        fill: true,
        label: "2nd Sem",
        data: [13586, 12049, 11837, 11384, 11510, 13728, 12700],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <TitleCard title={"Enrollment Statistics"}>
      <Line data={data} options={options} />
    </TitleCard>
  );
}

export default LineChart;
