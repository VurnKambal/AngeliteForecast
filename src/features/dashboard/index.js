import DashboardStats from "./components/DashboardStats";
import AmountStats from "./components/AmountStats";
import PageStats from "./components/PageStats";
import TitleCard from "../../components/Cards/TitleCard";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UserChannels from "./components/UserChannels";
import LineChart from "./components/LineChart";
import BarChart from "./components/BarChart";
import DashboardTopBar from "./components/DashboardTopBar";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";
import DoughnutChart from "./components/DoughnutChart";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import MetricsDescriptionCard from "./components/MetricsDescriptionCard.js";

// const firstYearData = [
//   {
//     Algorithm:
//       "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
//     Test_SMAPE: "37.59%",
//     Train_SMAPE: "23.15%",
//     Test_MAPE: "77.29%",
//     Train_MAPE: "38.56%",
//     Test_MAE: "15.4263",
//     Train_MAE: "8.5326",
//     Test_RMSE: "23.5313",
//     Train_RMSE: "15.4626",
//     Test_R2: "90.8392",
//     Train_R2: "97.6768",
//   },
//   {
//     Algorithm: "Simple Exponential Smoothing",
//     Test_SMAPE: "39.89%",
//     Train_SMAPE: "27.44%",
//     Test_MAPE: "61.70%",
//     Train_MAPE: "36.21%",
//     Test_MAE: "14.8668",
//     Train_MAE: "13.0385",
//     Test_RMSE: "22.3832",
//     Train_RMSE: "22.6535",
//     Test_R2: "91.7113",
//     Train_R2: "95.0135",
//   },

//   {
//     Algorithm: "XGBoost DART",
//     Test_SMAPE: "38.71%",
//     Train_SMAPE: "28.58%",
//     Test_MAPE: "76.69%",
//     Train_MAPE: "60.16%",
//     Test_MAE: "16.6070",
//     Train_MAE: "7.3415",
//     Test_RMSE: "25.0879",
//     Train_RMSE: "13.0439",
//     Test_R2: "89.5871",
//     Train_R2: "98.2567",
//   },
//   {
//     Algorithm: "Random Forest",
//     Test_SMAPE: "38.52%",
//     Train_SMAPE: "28.58%",
//     Test_MAPE: "81.23%",
//     Train_MAPE: "73.51%",
//     Test_MAE: "15.7459",
//     Train_MAE: "7.0336",
//     Test_RMSE: "23.6002",
//     Train_RMSE: "14.6424",
//     Test_R2: "90.7855",
//     Train_R2: "98.0426",
//   },
//   {
//     Algorithm: "SVR",
//     Test_SMAPE: "43.28%",
//     Train_SMAPE: "43.03%",
//     Test_MAPE: "61.75%",
//     Train_MAPE: "61.30%",
//     Test_MAE: "12.6862",
//     Train_MAE: "11.6088",
//     Test_RMSE: "21.8212",
//     Train_RMSE: "22.7144",
//     Test_R2: "90.4620",
//     Train_R2: "95.2699",
//   },
//   {
//     Algorithm: "KNN",
//     Test_SMAPE: "45.46%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "93.18%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "15.6051",
//     Train_MAE: "0.0000",
//     Test_RMSE: "20.1940",
//     Train_RMSE: "0.0000",
//     Test_R2: "91.3421",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm: "Linear Regression",
//     Test_SMAPE: "69.35%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "94.98%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "30.7678",
//     Train_MAE: "0.0000",
//     Test_RMSE: "48.3992",
//     Train_RMSE: "0.0000",
//     Test_R2: "53.7879",
//     Train_R2: "100.0000",
//   },
// ];

// const secondYearData = [
//   {
//     Algorithm: "XGBoost DART",
//     Test_SMAPE: "13.18%",
//     Train_SMAPE: "19.91%",
//     Test_MAPE: "20.35%",
//     Train_MAPE: "38.68%",
//     Test_MAE: "6.4284",
//     Train_MAE: "3.9163",
//     Test_RMSE: "11.6834",
//     Train_RMSE: "9.6113",
//     Test_R2: "96.6919",
//     Train_R2: "98.9662",
//   },
//   {
//     Algorithm: "Random Forest",
//     Test_SMAPE: "20.05%",
//     Train_SMAPE: "28.38%",
//     Test_MAPE: "52.40%",
//     Train_MAPE: "73.04%",
//     Test_MAE: "10.4922",
//     Train_MAE: "7.0445",
//     Test_RMSE: "15.2310",
//     Train_RMSE: "17.4591",
//     Test_R2: "94.3780",
//     Train_R2: "96.5889",
//   },
//   {
//     Algorithm: "Simple Exponential Smoothing",
//     Test_SMAPE: "35.86%",
//     Train_SMAPE: "20.06%",
//     Test_MAPE: "75.98%",
//     Train_MAPE: "26.22%",
//     Test_MAE: "23.2727",
//     Train_MAE: "10.3909",
//     Test_RMSE: "32.4151",
//     Train_RMSE: "19.1788",
//     Test_R2: "74.5357",
//     Train_R2: "96.2111",
//   },
//   {
//     Algorithm: "Moving Average (2-Years / 4-Semesters)",
//     Test_SMAPE: "30.12%",
//     Train_SMAPE: "7.53%",
//     Test_MAPE: "35.45%",
//     Train_MAPE: "7.60%",
//     Test_MAE: "32.7143",
//     Train_MAE: "9.7306",
//     Test_RMSE: "38.6253",
//     Train_RMSE: "19.1217",
//     Test_R2: "83.7959",
//     Train_R2: "98.5518",
//   },
//   {
//     Algorithm: "Linear Regression",
//     Test_SMAPE: "96.78%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "165.82%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "65.4476",
//     Train_MAE: "0.0000",
//     Test_RMSE: "100.1894",
//     Train_RMSE: "0.0000",
//     Test_R2: "-143.2647",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm: "KNN",
//     Test_SMAPE: "32.90%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "41.86%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "16.9654",
//     Train_MAE: "0.0000",
//     Test_RMSE: "23.5715",
//     Train_RMSE: "0.0000",
//     Test_R2: "86.5349",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm:
//       "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
//     Test_SMAPE: "18.66%",
//     Train_SMAPE: "12.38%",
//     Test_MAPE: "39.50%",
//     Train_MAPE: "17.78%",
//     Test_MAE: "10.3500",
//     Train_MAE: "5.0622",
//     Test_RMSE: "15.3668",
//     Train_RMSE: "11.3975",
//     Test_R2: "94.2773",
//     Train_R2: "98.6619",
//   },
// ];

// const thirdYearData = [
//   {
//     Algorithm: "XGBoost DART",
//     Test_SMAPE: "18.43%",
//     Train_SMAPE: "20.20%",
//     Test_MAPE: "32.56%",
//     Train_MAPE: "35.96%",
//     Test_MAE: "7.0878",
//     Train_MAE: "5.5062",
//     Test_RMSE: "9.8021",
//     Train_RMSE: "14.3784",
//     Test_R2: "98.3914",
//     Train_R2: "97.3055",
//   },
//   {
//     Algorithm: "Random Forest",
//     Test_SMAPE: "23.07%",
//     Train_SMAPE: "30.85%",
//     Test_MAPE: "60.50%",
//     Train_MAPE: "92.85%",
//     Test_MAE: "7.9125",
//     Train_MAE: "9.7227",
//     Test_RMSE: "11.3719",
//     Train_RMSE: "23.0339",
//     Test_R2: "97.8349",
//     Train_R2: "93.0849",
//   },
//   {
//     Algorithm: "Simple Exponential Smoothing",
//     Test_SMAPE: "35.69%",
//     Train_SMAPE: "19.92%",
//     Test_MAPE: "94.83%",
//     Train_MAPE: "33.96%",
//     Test_MAE: "12.4060",
//     Train_MAE: "11.9189",
//     Test_RMSE: "15.5783",
//     Train_RMSE: "29.1238",
//     Test_R2: "95.9370",
//     Train_R2: "89.7845",
//   },
//   {
//     Algorithm: "Moving Average (2-Years / 4-Semesters)",
//     Test_SMAPE: "28.64%",
//     Train_SMAPE: "12.88%",
//     Test_MAPE: "26.59%",
//     Train_MAPE: "25.17%",
//     Test_MAE: "19.7222",
//     Train_MAE: "9.6709",
//     Test_RMSE: "21.5926",
//     Train_RMSE: "21.2786",
//     Test_R2: "96.3362",
//     Train_R2: "96.3917",
//   },
//   {
//     Algorithm: "Linear Regression",
//     Test_SMAPE: "118.41%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "297.69%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "99.1901",
//     Train_MAE: "0.0000",
//     Test_RMSE: "201.4600",
//     Train_RMSE: "0.0000",
//     Test_R2: "-579.4863",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm: "KNN",
//     Test_SMAPE: "30.81%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "34.48%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "12.0206",
//     Train_MAE: "0.0000",
//     Test_RMSE: "15.0858",
//     Train_RMSE: "0.0000",
//     Test_R2: "96.1899",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm:
//       "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
//     Test_SMAPE: "21.06%",
//     Train_SMAPE: "14.20%",
//     Test_MAPE: "50.91%",
//     Train_MAPE: "23.32%",
//     Test_MAE: "7.1224",
//     Train_MAE: "7.8888",
//     Test_RMSE: "9.2598",
//     Train_RMSE: "18.3376",
//     Test_R2: "98.5645",
//     Train_R2: "95.9501",
//   },
// ];

// const fourthYearData = [
//   {
//     Algorithm: "XGBoost DART",
//     Test_SMAPE: "40.23%",
//     Train_SMAPE: "31.27%",
//     Test_MAPE: "125.02%",
//     Train_MAPE: "74.98%",
//     Test_MAE: "19.8159",
//     Train_MAE: "10.7263",
//     Test_RMSE: "47.3367",
//     Train_RMSE: "28.2215",
//     Test_R2: "63.7539",
//     Train_R2: "87.5069",
//   },
//   {
//     Algorithm: "Random Forest",
//     Test_SMAPE: "50.04%",
//     Train_SMAPE: "44.40%",
//     Test_MAPE: "219.79%",
//     Train_MAPE: "169.88%",
//     Test_MAE: "23.7482",
//     Train_MAE: "18.0796",
//     Test_RMSE: "47.3126",
//     Train_RMSE: "39.8729",
//     Test_R2: "63.7908",
//     Train_R2: "75.0617",
//   },
//   {
//     Algorithm: "Simple Exponential Smoothing",
//     Test_SMAPE: "50.43%",
//     Train_SMAPE: "24.38%",
//     Test_MAPE: "136.63%",
//     Train_MAPE: "69.41%",
//     Test_MAE: "28.3846",
//     Train_MAE: "13.3366",
//     Test_RMSE: "56.6267",
//     Train_RMSE: "38.2312",
//     Test_R2: "50.6673",
//     Train_R2: "79.1199",
//   },
//   {
//     Algorithm: "Moving Average (2-Years / 4-Semesters)",
//     Test_SMAPE: "39.67%",
//     Train_SMAPE: "14.92%",
//     Test_MAPE: "31.81%",
//     Train_MAPE: "49.15%",
//     Test_MAE: "49.1667",
//     Train_MAE: "9.7708",
//     Test_RMSE: "102.5599",
//     Train_RMSE: "29.3382",
//     Test_R2: "29.8100",
//     Train_R2: "80.9465",
//   },
//   {
//     Algorithm: "Linear Regression",
//     Test_SMAPE: "98.04%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "198.41%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "50.8715",
//     Train_MAE: "0.0000",
//     Test_RMSE: "97.6989",
//     Train_RMSE: "0.0000",
//     Test_R2: "-46.8494",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm: "KNN",
//     Test_SMAPE: "51.05%",
//     Train_SMAPE: "0.00%",
//     Test_MAPE: "130.84%",
//     Train_MAPE: "0.00%",
//     Test_MAE: "25.1877",
//     Train_MAE: "0.0000",
//     Test_RMSE: "52.0819",
//     Train_RMSE: "0.0000",
//     Test_R2: "56.1229",
//     Train_R2: "100.0000",
//   },
//   {
//     Algorithm:
//       "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
//     Test_SMAPE: "41.73%",
//     Train_SMAPE: "25.65%",
//     Test_MAPE: "135.08%",
//     Train_MAPE: "76.15%",
//     Test_MAE: "23.1027",
//     Train_MAE: "13.8772",
//     Test_RMSE: "48.9615",
//     Train_RMSE: "33.3665",
//     Test_R2: "63.1191",
//     Train_R2: "84.0956",
//   },
// ];

const firstYearData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "37.59%",
    Train_SMAPE: "23.15%",
    Test_MAPE: "77.29%",
    Train_MAPE: "38.56%",
    Test_MAE: "15.4263",
    Train_MAE: "8.5326",
    Test_RMSE: "23.5313",
    Train_RMSE: "15.4626",
    Test_R2: "90.8392",
    Train_R2: "97.6768",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "39.89%",
    Train_SMAPE: "27.44%",
    Test_MAPE: "61.70%",
    Train_MAPE: "36.21%",
    Test_MAE: "14.8668",
    Train_MAE: "13.0385",
    Test_RMSE: "22.3832",
    Train_RMSE: "22.6535",
    Test_R2: "91.7113",
    Train_R2: "95.0135",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "N/A", // Placeholder value if needed
    Train_SMAPE: "N/A", // Placeholder value if needed
    Test_MAPE: "N/A", // Placeholder value if needed
    Train_MAPE: "N/A", // Placeholder value if needed
    Test_MAE: "N/A", // Placeholder value if needed
    Train_MAE: "N/A", // Placeholder value if needed
    Test_RMSE: "N/A", // Placeholder value if needed
    Train_RMSE: "N/A", // Placeholder value if needed
    Test_R2: "N/A", // Placeholder value if needed
    Train_R2: "N/A", // Placeholder value if needed
  },
];

const secondYearData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "18.66%",
    Train_SMAPE: "12.38%",
    Test_MAPE: "39.50%",
    Train_MAPE: "17.78%",
    Test_MAE: "10.3500",
    Train_MAE: "5.0622",
    Test_RMSE: "15.3668",
    Train_RMSE: "11.3975",
    Test_R2: "94.2773",
    Train_R2: "98.6619",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "35.86%",
    Train_SMAPE: "20.06%",
    Test_MAPE: "75.98%",
    Train_MAPE: "26.22%",
    Test_MAE: "23.2727",
    Train_MAE: "10.3909",
    Test_RMSE: "32.4151",
    Train_RMSE: "19.1788",
    Test_R2: "74.5357",
    Train_R2: "96.2111",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "30.12%",
    Train_SMAPE: "7.53%",
    Test_MAPE: "35.45%",
    Train_MAPE: "7.60%",
    Test_MAE: "32.7143",
    Train_MAE: "9.7306",
    Test_RMSE: "38.6253",
    Train_RMSE: "19.1217",
    Test_R2: "83.7959",
    Train_R2: "98.5518",
  },
];

const thirdYearData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "21.06%",
    Train_SMAPE: "14.20%",
    Test_MAPE: "50.91%",
    Train_MAPE: "23.32%",
    Test_MAE: "7.1224",
    Train_MAE: "7.8888",
    Test_RMSE: "9.2598",
    Train_RMSE: "18.3376",
    Test_R2: "98.5645",
    Train_R2: "95.9501",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "35.69%",
    Train_SMAPE: "19.92%",
    Test_MAPE: "94.83%",
    Train_MAPE: "33.96%",
    Test_MAE: "12.4060",
    Train_MAE: "11.9189",
    Test_RMSE: "15.5783",
    Train_RMSE: "29.1238",
    Test_R2: "95.9370",
    Train_R2: "89.7845",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "28.64%",
    Train_SMAPE: "12.88%",
    Test_MAPE: "26.59%",
    Train_MAPE: "25.17%",
    Test_MAE: "19.7222",
    Train_MAE: "9.6709",
    Test_RMSE: "21.5926",
    Train_RMSE: "21.2786",
    Test_R2: "96.3362",
    Train_R2: "96.3917",
  },
];

const fourthYearData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "41.73%",
    Train_SMAPE: "25.65%",
    Test_MAPE: "135.08%",
    Train_MAPE: "76.15%",
    Test_MAE: "23.1027",
    Train_MAE: "13.8772",
    Test_RMSE: "48.9615",
    Train_RMSE: "33.3665",
    Test_R2: "63.1191",
    Train_R2: "84.0956",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "50.43%",
    Train_SMAPE: "24.38%",
    Test_MAPE: "136.63%",
    Train_MAPE: "69.41%",
    Test_MAE: "28.3846",
    Train_MAE: "13.3366",
    Test_RMSE: "56.6267",
    Train_RMSE: "38.2312",
    Test_R2: "50.6673",
    Train_R2: "79.1199",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "39.67%",
    Train_SMAPE: "14.92%",
    Test_MAPE: "31.81%",
    Train_MAPE: "49.15%",
    Test_MAE: "49.1667",
    Train_MAE: "9.7708",
    Test_RMSE: "102.5599",
    Train_RMSE: "29.3382",
    Test_R2: "29.8100",
    Train_R2: "80.9465",
  },
];

function Dashboard() {
  const [testSortConfigFirstYear, setTestSortConfigFirstYear] = useState({
    key: "Test_SMAPE_FirstYear",
    direction: "asc",
  });
  const [testSortConfigSecondYear, setTestSortConfigSecondYear] = useState({
    key: "Test_SMAPE_SecondYear",
    direction: "asc",
  });
  const [testSortConfigThirdYear, setTestSortConfigThirdYear] = useState({
    key: "Test_SMAPE_ThirdYear",
    direction: "asc",
  });
  const [tesSortConfigFourthYear, setTestSortConfigFourthYear] = useState({
    key: "Test_SMAPE_FourthYear",
    direction: "asc",
  });

  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/dashboard-stats`
        );
        const data = response.data;

        setStatsData([
          {
            title: `${data.enrollment.year}-${data.enrollment.year + 1} ${
              data.enrollment.semester
            } Sem`,
            value: data.enrollment.total.toLocaleString(),
            icon: <UserGroupIcon className="w-8 h-8" />,
            description: "Total Students",
          },
          {
            title: `${data.inflation.year} `,
            value: `${data.inflation.rate.toFixed(4)}%`,
            icon: <CreditCardIcon className="w-8 h-8" />,
            description: "Philippines Inflation Rate",
          },
          {
            title: `${data.hfce.year} ${data.hfce.quarter}`,
            value: data.hfce.value.toLocaleString(),
            icon: <CircleStackIcon className="w-8 h-8" />,
            description: "Household Final Consumption Expenditure",
          },
          {
            title: `${data.cpi.year}  ${data.cpi.month}`,
            value: data.cpi.value.toFixed(1),
            icon: <UsersIcon className="w-8 h-8" />,
            description: `${data.cpi.region} Consumer Price Index`,
          },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchStatsData();
  }, []);
  const handleTestSortFirstYear = (key) => {
    const direction =
      testSortConfigFirstYear.key === key &&
      testSortConfigFirstYear.direction === "asc"
        ? "desc"
        : "asc";
    setTestSortConfigFirstYear({ key, direction });
  };

  const handleTestSortSecondYear = (key) => {
    const direction =
      testSortConfigSecondYear.key === key &&
      testSortConfigSecondYear.direction === "asc"
        ? "desc"
        : "asc";
    setTestSortConfigSecondYear({ key, direction });
  };

  const handleTestSortThirdYear = (key) => {
    const direction =
      testSortConfigThirdYear.key === key &&
      testSortConfigThirdYear.direction === "asc"
        ? "desc"
        : "asc";
    setTestSortConfigThirdYear({ key, direction });
  };

  const handleTestSortFourthYear = (key) => {
    const direction =
      tesSortConfigFourthYear.key === key &&
      tesSortConfigFourthYear.direction === "asc"
        ? "desc"
        : "asc";
    setTestSortConfigFourthYear({ key, direction });
  };

  const sortedFirstYearData = [...firstYearData].sort((a, b) => {
    if (testSortConfigFirstYear.direction === "asc") {
      return (
        parseFloat(a[testSortConfigFirstYear.key]) -
        parseFloat(b[testSortConfigFirstYear.key])
      );
    } else {
      return (
        parseFloat(b[testSortConfigFirstYear.key]) -
        parseFloat(a[testSortConfigFirstYear.key])
      );
    }
  });

  const sortedSecondYearData = [...secondYearData].sort((a, b) => {
    if (testSortConfigSecondYear.direction === "asc") {
      return (
        parseFloat(a[testSortConfigSecondYear.key]) -
        parseFloat(b[testSortConfigSecondYear.key])
      );
    } else {
      return (
        parseFloat(b[testSortConfigSecondYear.key]) -
        parseFloat(a[testSortConfigSecondYear.key])
      );
    }
  });

  const sortedThirdYearData = [...thirdYearData].sort((a, b) => {
    if (testSortConfigThirdYear.direction === "asc") {
      return (
        parseFloat(a[testSortConfigThirdYear.key]) -
        parseFloat(b[testSortConfigThirdYear.key])
      );
    } else {
      return (
        parseFloat(b[testSortConfigThirdYear.key]) -
        parseFloat(a[testSortConfigThirdYear.key])
      );
    }
  });

  const sortedFourthYearData = [...fourthYearData].sort((a, b) => {
    if (tesSortConfigFourthYear.direction === "asc") {
      return (
        parseFloat(a[tesSortConfigFourthYear.key]) -
        parseFloat(b[tesSortConfigFourthYear.key])
      );
    } else {
      return (
        parseFloat(b[tesSortConfigFourthYear.key]) -
        parseFloat(a[tesSortConfigFourthYear.key])
      );
    }
  });

  // const sortedSplitData = [...splitData].sort((a, b) => {
  //   if (trainSortConfig.direction === "asc") {
  //     return (
  //       parseFloat(a[trainSortConfig.key]) - parseFloat(b[trainSortConfig.key])
  //     );
  //   } else {
  //     return (
  //       parseFloat(b[trainSortConfig.key]) - parseFloat(a[trainSortConfig.key])
  //     );
  //   }
  // });

  return (
    <>
      {/** ---------------------- Different stats content 1 ------------------------- */}
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>

      {/** ---------------------- Metrics description ------------------------- */}
      {/* <div className="mt-10">
        <MetricsDescriptionCard />
      </div> */}

      {/** ---------------------- Metrics tables ------------------------- */}
      <div className="mt-10">
        {/** ---------------------- 1st Year ------------------------- */}
        <TitleCard title="1st Year" topMargin="mt-2">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSortFirstYear("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSortFirstYear("Test_SMAPE")}
                  >
                    Test SMAPE
                    {testSortConfigFirstYear.key === "Test_SMAPE" &&
                      (testSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSortFirstYear("Test_MAPE")}
                  >
                    Test MAPE
                    {testSortConfigFirstYear.key === "Test_MAPE" &&
                      (testSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSortFirstYear("Test_MAE")}
                  >
                    Test MAE
                    {testSortConfigFirstYear.key === "Test_MAE" &&
                      (testSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSortFirstYear("Test_RMSE")}
                  >
                    Test RMSE
                    {testSortConfigFirstYear.key === "Test_RMSE" &&
                      (testSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSortFirstYear("Test_R2")}
                  >
                    Test R2
                    {testSortConfigFirstYear.key === "Test_R2" &&
                      (testSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFirstYearData.map((u, k) => (
                  <tr key={k}>
                    <th>{k + 1}</th>
                    <td>{u.Algorithm}</td>
                    <td>{u.Test_SMAPE}</td>
                    <td>{u.Test_MAPE}</td>
                    <td>{u.Test_MAE}</td>
                    <td>{u.Test_RMSE}</td>
                    <td>{u.Test_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>

        {/** ---------------------- 2nd Year ------------------------- */}
        <div className="mt-10">
          <TitleCard title="2nd Year" topMargin="mt-2">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortSecondYear("Algorithm")}
                    >
                      Forecasting Algorithm
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortSecondYear("Test_SMAPE")}
                    >
                      Test SMAPE
                      {testSortConfigSecondYear.key === "Test_SMAPE" &&
                        (testSortConfigSecondYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortSecondYear("Test_MAPE")}
                    >
                      Test MAPE
                      {testSortConfigSecondYear.key === "Test_MAPE" &&
                        (testSortConfigSecondYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortSecondYear("Test_MAE")}
                    >
                      Test MAE
                      {testSortConfigSecondYear.key === "Test_MAE" &&
                        (testSortConfigSecondYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortSecondYear("Test_RMSE")}
                    >
                      Test RMSE
                      {testSortConfigSecondYear.key === "Test_RMSE" &&
                        (testSortConfigSecondYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortSecondYear("Test_R2")}
                    >
                      Test R2
                      {testSortConfigSecondYear.key === "Test_R2" &&
                        (testSortConfigSecondYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedSecondYearData.map((u, k) => (
                    <tr key={k}>
                      <th>{k + 1}</th>
                      <td>{u.Algorithm}</td>
                      <td>{u.Test_SMAPE}</td>
                      <td>{u.Test_MAPE}</td>
                      <td>{u.Test_MAE}</td>
                      <td>{u.Test_RMSE}</td>
                      <td>{u.Test_R2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TitleCard>
        </div>

        {/** ---------------------- 3rd Year ------------------------- */}
        <div className="mt-10">
          <TitleCard title="3rd Year" topMargin="mt-2">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortThirdYear("Algorithm")}
                    >
                      Forecasting Algorithm
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortThirdYear("Test_SMAPE")}
                    >
                      Test SMAPE
                      {testSortConfigThirdYear.key === "Test_SMAPE" &&
                        (testSortConfigThirdYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortThirdYear("Test_MAPE")}
                    >
                      Test MAPE
                      {testSortConfigThirdYear.key === "Test_MAPE" &&
                        (testSortConfigThirdYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortThirdYear("Test_MAE")}
                    >
                      Test MAE
                      {testSortConfigThirdYear.key === "Test_MAE" &&
                        (testSortConfigThirdYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortThirdYear("Test_RMSE")}
                    >
                      Test RMSE
                      {testSortConfigThirdYear.key === "Test_RMSE" &&
                        (testSortConfigThirdYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortThirdYear("Test_R2")}
                    >
                      Test R2
                      {testSortConfigThirdYear.key === "Test_R2" &&
                        (testSortConfigThirdYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedThirdYearData.map((u, k) => (
                    <tr key={k}>
                      <th>{k + 1}</th>
                      <td>{u.Algorithm}</td>
                      <td>{u.Test_SMAPE}</td>
                      <td>{u.Test_MAPE}</td>
                      <td>{u.Test_MAE}</td>
                      <td>{u.Test_RMSE}</td>
                      <td>{u.Test_R2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TitleCard>
        </div>

        {/** ---------------------- 4th Year ------------------------- */}
        <div className="mt-10">
          <TitleCard title="4th Year" topMargin="mt-2">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortFourthYear("Algorithm")}
                    >
                      Forecasting Algorithm
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortFourthYear("Test_SMAPE")}
                    >
                      Test SMAPE
                      {tesSortConfigFourthYear.key === "Test_SMAPE" &&
                        (tesSortConfigFourthYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortFourthYear("Test_MAPE")}
                    >
                      Test MAPE
                      {tesSortConfigFourthYear.key === "Test_MAPE" &&
                        (tesSortConfigFourthYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortFourthYear("Test_MAE")}
                    >
                      Test MAE
                      {tesSortConfigFourthYear.key === "Test_MAE" &&
                        (tesSortConfigFourthYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortFourthYear("Test_RMSE")}
                    >
                      Test RMSE
                      {tesSortConfigFourthYear.key === "Test_RMSE" &&
                        (tesSortConfigFourthYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                    <th
                      className="cursor-pointer normal-case"
                      onClick={() => handleTestSortFourthYear("Test_R2")}
                    >
                      Test R2
                      {tesSortConfigFourthYear.key === "Test_R2" &&
                        (tesSortConfigFourthYear.direction === "asc" ? (
                          <ChevronUpIcon className="w-5 h-5 ml-2" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 ml-2" />
                        ))}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFourthYearData.map((u, k) => (
                    <tr key={k}>
                      <th>{k + 1}</th>
                      <td>{u.Algorithm}</td>
                      <td>{u.Test_SMAPE}</td>
                      <td>{u.Test_MAPE}</td>
                      <td>{u.Test_MAE}</td>
                      <td>{u.Test_RMSE}</td>
                      <td>{u.Test_R2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TitleCard>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
