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
import { useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const statsData = [
  {
    title: "2024-2025 1st sem Total",
    value: "14,796",
    icon: <UserGroupIcon className="w-8 h-8" />,
    description: "students",
  },
  {
    title: "2023 Inflation rate",
    value: "5.9780%",
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: "Previous Year",
  },
  {
    title: "2024 HFCE",
    value: "4,216,127",
    icon: <CircleStackIcon className="w-8 h-8" />,
    description: "2nd Quarter",
  },
  {
    title: "2024 Consumer Price Index",
    value: "107.4",
    icon: <UsersIcon className="w-8 h-8" />,
    description: "Region 3",
  },
];

const combinedData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "29.11%",
    Train_SMAPE: "21.44%",
    Test_MAPE: "54.60%",
    Train_MAPE: "33.52%",
    Test_MAE: "9.1153",
    Train_MAE: "7.6305",
    Test_RMSE: "12.2706",
    Train_RMSE: "12.6801",
    Test_R2: "96.8033",
    Train_R2: "98.5265",
  },
  {
    Algorithm: "Simple Exponential Smoothing (EMA)",
    Test_SMAPE: "24.16%",
    Train_SMAPE: "27.07%",
    Test_MAPE: "31.16%",
    Train_MAPE: "34.90%",
    Test_MAE: "12.0113",
    Train_MAE: "13.1002",
    Test_RMSE: "18.4763",
    Train_RMSE: "23.0617",
    Test_R2: "92.7523",
    Train_R2: "95.1258",
  },
  {
    Algorithm: "SGD Regressor",
    Test_SMAPE: "33.25%",
    Train_SMAPE: "37.68%",
    Test_MAPE: "54.80%",
    Train_MAPE: "65.68%",
    Test_MAE: "12.3179",
    Train_MAE: "11.1350",
    Test_RMSE: "21.4592",
    Train_RMSE: "20.9905",
    Test_R2: "90.7759",
    Train_R2: "95.9606",
  },
  {
    Algorithm: "Ensemble (Simple Exponential Smoothing + Random Forest)",
    Test_SMAPE: "37.25%",
    Train_SMAPE: "28.87%",
    Test_MAPE: "73.05%",
    Train_MAPE: "60.61%",
    Test_MAE: "15.6855",
    Train_MAE: "8.8749",
    Test_RMSE: "23.7927",
    Train_RMSE: "19.5961",
    Test_R2: "90.6345",
    Train_R2: "96.5017",
  },
  {
    Algorithm: "XGBoost DART",
    Test_SMAPE: "38.52%",
    Train_SMAPE: "37.63%",
    Test_MAPE: "80.42%",
    Train_MAPE: "119.11%",
    Test_MAE: "16.7667",
    Train_MAE: "10.7518",
    Test_RMSE: "24.7067",
    Train_RMSE: "22.2941",
    Test_R2: "89.9011",
    Train_R2: "95.4623",
  },
  {
    Algorithm: "Random Forest",
    Test_SMAPE: "38.52%",
    Train_SMAPE: "28.58%",
    Test_MAPE: "81.23%",
    Train_MAPE: "73.51%",
    Test_MAE: "15.7459",
    Train_MAE: "7.0336",
    Test_RMSE: "23.6002",
    Train_RMSE: "14.6424",
    Test_R2: "90.7855",
    Train_R2: "98.0426",
  },
  {
    Algorithm: "SVR",
    Test_SMAPE: "43.28%",
    Train_SMAPE: "43.03%",
    Test_MAPE: "61.75%",
    Train_MAPE: "61.30%",
    Test_MAE: "12.6862",
    Train_MAE: "11.6088",
    Test_RMSE: "21.8212",
    Train_RMSE: "22.7144",
    Test_R2: "90.4620",
    Train_R2: "95.2699",
  },
  {
    Algorithm: "KNN",
    Test_SMAPE: "45.46%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "93.18%",
    Train_MAPE: "0.00%",
    Test_MAE: "15.6051",
    Train_MAE: "0.0000",
    Test_RMSE: "20.1940",
    Train_RMSE: "0.0000",
    Test_R2: "91.3421",
    Train_R2: "100.0000",
  },
  {
    Algorithm: "Linear Regression",
    Test_SMAPE: "69.35%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "94.98%",
    Train_MAPE: "0.00%",
    Test_MAE: "30.7678",
    Train_MAE: "0.0000",
    Test_RMSE: "48.3992",
    Train_RMSE: "0.0000",
    Test_R2: "53.7879",
    Train_R2: "100.0000",
  },
];

const firstYearData = [
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "29.11%",
    Train_SMAPE: "21.44%",
    Test_MAPE: "54.60%",
    Train_MAPE: "33.52%",
    Test_MAE: "9.1153",
    Train_MAE: "7.6305",
    Test_RMSE: "12.2706",
    Train_RMSE: "12.6801",
    Test_R2: "96.8033",
    Train_R2: "98.5265",
  },
  {
    Algorithm: "Simple Exponential Smoothing (EMA)",
    Test_SMAPE: "24.16%",
    Train_SMAPE: "27.07%",
    Test_MAPE: "31.16%",
    Train_MAPE: "34.90%",
    Test_MAE: "12.0113",
    Train_MAE: "13.1002",
    Test_RMSE: "18.4763",
    Train_RMSE: "23.0617",
    Test_R2: "92.7523",
    Train_R2: "95.1258",
  },
  {
    Algorithm: "SGD Regressor",
    Test_SMAPE: "33.25%",
    Train_SMAPE: "37.68%",
    Test_MAPE: "54.80%",
    Train_MAPE: "65.68%",
    Test_MAE: "12.3179",
    Train_MAE: "11.1350",
    Test_RMSE: "21.4592",
    Train_RMSE: "20.9905",
    Test_R2: "90.7759",
    Train_R2: "95.9606",
  },
  {
    Algorithm: "Ensemble (Simple Exponential Smoothing + Random Forest)",
    Test_SMAPE: "37.25%",
    Train_SMAPE: "28.87%",
    Test_MAPE: "73.05%",
    Train_MAPE: "60.61%",
    Test_MAE: "15.6855",
    Train_MAE: "8.8749",
    Test_RMSE: "23.7927",
    Train_RMSE: "19.5961",
    Test_R2: "90.6345",
    Train_R2: "96.5017",
  },
  {
    Algorithm: "XGBoost DART",
    Test_SMAPE: "38.52%",
    Train_SMAPE: "37.63%",
    Test_MAPE: "80.42%",
    Train_MAPE: "119.11%",
    Test_MAE: "16.7667",
    Train_MAE: "10.7518",
    Test_RMSE: "24.7067",
    Train_RMSE: "22.2941",
    Test_R2: "89.9011",
    Train_R2: "95.4623",
  },
  {
    Algorithm: "Random Forest",
    Test_SMAPE: "38.52%",
    Train_SMAPE: "28.58%",
    Test_MAPE: "81.23%",
    Train_MAPE: "73.51%",
    Test_MAE: "15.7459",
    Train_MAE: "7.0336",
    Test_RMSE: "23.6002",
    Train_RMSE: "14.6424",
    Test_R2: "90.7855",
    Train_R2: "98.0426",
  },
  {
    Algorithm: "SVR",
    Test_SMAPE: "43.28%",
    Train_SMAPE: "43.03%",
    Test_MAPE: "61.75%",
    Train_MAPE: "61.30%",
    Test_MAE: "12.6862",
    Train_MAE: "11.6088",
    Test_RMSE: "21.8212",
    Train_RMSE: "22.7144",
    Test_R2: "90.4620",
    Train_R2: "95.2699",
  },
  {
    Algorithm: "KNN",
    Test_SMAPE: "45.46%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "93.18%",
    Train_MAPE: "0.00%",
    Test_MAE: "15.6051",
    Train_MAE: "0.0000",
    Test_RMSE: "20.1940",
    Train_RMSE: "0.0000",
    Test_R2: "91.3421",
    Train_R2: "100.0000",
  },
  {
    Algorithm: "Linear Regression",
    Test_SMAPE: "69.35%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "94.98%",
    Train_MAPE: "0.00%",
    Test_MAE: "30.7678",
    Train_MAE: "0.0000",
    Test_RMSE: "48.3992",
    Train_RMSE: "0.0000",
    Test_R2: "53.7879",
    Train_R2: "100.0000",
  },
];

const secondYearData = [
  {
    Algorithm: "XGBoost DART",
    Test_SMAPE: "40.05%",
    Train_SMAPE: "32.28%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "5.9352",
    Train_MAE: "4.3145",
    Test_RMSE: "8.8488",
    Train_RMSE: "9.5219",
    Test_R2: "98.1032",
    Train_R2: "99.0757",
  },
  {
    Algorithm: "Random Forest",
    Test_SMAPE: "43.83%",
    Train_SMAPE: "40.04%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "10.3839",
    Train_MAE: "8.3084",
    Test_RMSE: "16.1972",
    Train_RMSE: "22.2177",
    Test_R2: "93.6446",
    Train_R2: "94.9680",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "60.46%",
    Train_SMAPE: "35.88%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "20.7693",
    Train_MAE: "9.6554",
    Test_RMSE: "30.4054",
    Train_RMSE: "18.1941",
    Test_R2: "77.9094",
    Train_R2: "96.8404",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "nan%",
    Train_SMAPE: "nan%",
    Test_MAPE: "nan%",
    Train_MAPE: "nan%",
    Test_MAE: "21.4024",
    Train_MAE: "8.1844",
    Test_RMSE: "32.9691",
    Train_RMSE: "15.5982",
    Test_R2: "74.0270",
    Train_R2: "97.6777",
  },
  {
    Algorithm: "Linear Regression",
    Test_SMAPE: "89.77%",
    Train_SMAPE: "nan%",
    Test_MAPE: "inf%",
    Train_MAPE: "nan%",
    Test_MAE: "40.7053",
    Train_MAE: "0.0000",
    Test_RMSE: "63.4148",
    Train_RMSE: "0.0000",
    Test_R2: "3.9078",
    Train_R2: "100.0000",
  },
  {
    Algorithm: "KNN",
    Test_SMAPE: "60.00%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "inf%",
    Train_MAPE: "0.00%",
    Test_MAE: "15.0537",
    Train_MAE: "0.0000",
    Test_RMSE: "22.0257",
    Train_RMSE: "0.0000",
    Test_R2: "88.2476",
    Train_R2: "100.0000",
  },
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "45.08%",
    Train_SMAPE: "28.67%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "10.3634",
    Train_MAE: "6.3185",
    Test_RMSE: "15.2544",
    Train_RMSE: "14.4884",
    Test_R2: "94.4397",
    Train_R2: "97.9964",
  },
];

const thirdYearData = [
  {
    Algorithm: "XGBoost DART",
    Test_SMAPE: "35.73%",
    Train_SMAPE: "61.21%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "6.0389",
    Train_MAE: "4.6741",
    Test_RMSE: "9.4772",
    Train_RMSE: "15.6499",
    Test_R2: "98.4051",
    Train_R2: "96.6448",
  },
  {
    Algorithm: "Random Forest",
    Test_SMAPE: "39.34%",
    Train_SMAPE: "68.93%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "6.3856",
    Train_MAE: "7.7299",
    Test_RMSE: "8.6894",
    Train_RMSE: "23.8691",
    Test_R2: "98.6592",
    Train_R2: "92.1952",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "54.19%",
    Train_SMAPE: "92.11%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "10.8893",
    Train_MAE: "20.4279",
    Test_RMSE: "14.4304",
    Train_RMSE: "52.6849",
    Test_R2: "96.3022",
    Train_R2: "64.8599",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "nan%",
    Train_SMAPE: "nan%",
    Test_MAPE: "nan%",
    Train_MAPE: "nan%",
    Test_MAE: "13.2439",
    Train_MAE: "16.6308",
    Test_RMSE: "18.1711",
    Train_RMSE: "41.5461",
    Test_R2: "94.1367",
    Train_R2: "78.1481",
  },
  {
    Algorithm: "Linear Regression",
    Test_SMAPE: "89.50%",
    Train_SMAPE: "nan%",
    Test_MAPE: "inf%",
    Train_MAPE: "nan%",
    Test_MAE: "47.4761",
    Train_MAE: "0.0000",
    Test_RMSE: "99.4524",
    Train_RMSE: "0.0000",
    Test_R2: "-75.6360",
    Train_R2: "100.0000",
  },
  {
    Algorithm: "KNN",
    Test_SMAPE: "50.94%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "inf%",
    Train_MAPE: "0.00%",
    Test_MAE: "10.5115",
    Train_MAE: "0.0000",
    Test_RMSE: "13.9605",
    Train_RMSE: "0.0000",
    Test_R2: "96.5392",
    Train_R2: "100.0000",
  },
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "39.57%",
    Train_SMAPE: "63.21%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "5.9214",
    Train_MAE: "8.2998",
    Test_RMSE: "7.5771",
    Train_RMSE: "25.9290",
    Test_R2: "98.9805",
    Train_R2: "91.4886",
  },
];

const fourthYearData = [
  {
    Algorithm: "XGBoost DART",
    Test_SMAPE: "46.28%",
    Train_SMAPE: "76.99%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "17.4242",
    Train_MAE: "6.6755",
    Test_RMSE: "45.7607",
    Train_RMSE: "20.6185",
    Test_R2: "66.3200",
    Train_R2: "90.7643",
  },
  {
    Algorithm: "Random Forest",
    Test_SMAPE: "47.48%",
    Train_SMAPE: "83.88%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "21.2188",
    Train_MAE: "10.6542",
    Test_RMSE: "48.9459",
    Train_RMSE: "31.6831",
    Test_R2: "61.4683",
    Train_R2: "78.1921",
  },
  {
    Algorithm: "Simple Exponential Smoothing",
    Test_SMAPE: "75.98%",
    Train_SMAPE: "104.09%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "27.0176",
    Train_MAE: "17.4410",
    Test_RMSE: "55.3795",
    Train_RMSE: "44.2616",
    Test_R2: "51.6500",
    Train_R2: "61.7447",
  },
  {
    Algorithm: "Moving Average (2-Years / 4-Semesters)",
    Test_SMAPE: "70.98%",
    Train_SMAPE: "nan%",
    Test_MAPE: "inf%",
    Train_MAPE: "nan%",
    Test_MAE: "29.0321",
    Train_MAE: "14.0408",
    Test_RMSE: "60.3772",
    Train_RMSE: "33.6077",
    Test_R2: "42.5296",
    Train_R2: "77.9446",
  },
  {
    Algorithm: "Linear Regression",
    Test_SMAPE: "154.99%",
    Train_SMAPE: "nan%",
    Test_MAPE: "inf%",
    Train_MAPE: "nan%",
    Test_MAE: "238.3645",
    Train_MAE: "0.0000",
    Test_RMSE: "908.7180",
    Train_RMSE: "0.0000",
    Test_R2: "-12918.3712",
    Train_R2: "100.0000",
  },
  {
    Algorithm: "KNN",
    Test_SMAPE: "65.73%",
    Train_SMAPE: "0.00%",
    Test_MAPE: "inf%",
    Train_MAPE: "0.00%",
    Test_MAE: "20.8987",
    Train_MAE: "0.0000",
    Test_RMSE: "48.5275",
    Train_RMSE: "0.0000",
    Test_R2: "62.1242",
    Train_R2: "100.0000",
  },
  {
    Algorithm:
      "Ensemble (Simple Exponential Smoothing + Random Forest + XGBoost DART)",
    Test_SMAPE: "50.88%",
    Train_SMAPE: "79.46%",
    Test_MAPE: "inf%",
    Train_MAPE: "inf%",
    Test_MAE: "20.2598",
    Train_MAE: "10.0076",
    Test_RMSE: "47.1980",
    Train_RMSE: "29.4513",
    Test_R2: "64.8808",
    Train_R2: "83.0626",
  },
];

function Dashboard() {
  const [testSortConfig, setTestSortConfig] = useState({
    key: "Test_SMAPE",
    direction: "asc",
  });
  const [trainSortConfig, setTrainSortConfig] = useState({
    key: "Train_SMAPE",
    direction: "asc",
  });
  const [trainSortConfigFirstYear, setTrainSortConfigFirstYear] = useState({
    key: "Train_SMAPE_FirstYear",
    direction: "asc",
  });
  const [trainSortConfigSecondYear, setTrainSortConfigSecondYear] = useState({
    key: "Train_SMAPE_SecondYear",
    direction: "asc",
  });
  const [trainSortConfigThirdYear, setTrainSortConfigThirdYear] = useState({
    key: "Train_SMAPE_ThirdYear",
    direction: "asc",
  });
  const [trainSortConfigFourthYear, setTrainSortConfigFourthYear] = useState({
    key: "Train_SMAPE_FourthYear",
    direction: "asc",
  });

  const handleTestSort = (key) => {
    const direction =
      testSortConfig.key === key && testSortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setTestSortConfig({ key, direction });
  };

  const handleTrainSort = (key) => {
    const direction =
      trainSortConfig.key === key && trainSortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setTrainSortConfig({ key, direction });
  };

  const handleTrainSortFirstYear = (key) => {
    const direction =
      trainSortConfigFirstYear.key === key &&
      trainSortConfigFirstYear.direction === "asc"
        ? "desc"
        : "asc";
    setTrainSortConfigFirstYear({ key, direction });
  };

  const handleTrainSortSecondYear = (key) => {
    const direction =
      trainSortConfigSecondYear.key === key &&
      trainSortConfigSecondYear.direction === "asc"
        ? "desc"
        : "asc";
    setTrainSortConfigSecondYear({ key, direction });
  };

  const handleTrainSortThirdYear = (key) => {
    const direction =
      trainSortConfigThirdYear.key === key &&
      trainSortConfigThirdYear.direction === "asc"
        ? "desc"
        : "asc";
    setTrainSortConfigThirdYear({ key, direction });
  };

  const handleTrainSortFourthYear = (key) => {
    const direction =
      trainSortConfigFourthYear.key === key &&
      trainSortConfigFourthYear.direction === "asc"
        ? "desc"
        : "asc";
    setTrainSortConfigFourthYear({ key, direction });
  };

  const sortedTestData = [...combinedData].sort((a, b) => {
    if (testSortConfig.direction === "asc") {
      return (
        parseFloat(a[testSortConfig.key]) - parseFloat(b[testSortConfig.key])
      );
    } else {
      return (
        parseFloat(b[testSortConfig.key]) - parseFloat(a[testSortConfig.key])
      );
    }
  });

  const sortedTrainData = [...combinedData].sort((a, b) => {
    if (trainSortConfig.direction === "asc") {
      return (
        parseFloat(a[trainSortConfig.key]) - parseFloat(b[trainSortConfig.key])
      );
    } else {
      return (
        parseFloat(b[trainSortConfig.key]) - parseFloat(a[trainSortConfig.key])
      );
    }
  });
  const sortedFirstYearData = [...firstYearData].sort((a, b) => {
    if (trainSortConfigFirstYear.direction === "asc") {
      return (
        parseFloat(a[trainSortConfigFirstYear.key]) -
        parseFloat(b[trainSortConfigFirstYear.key])
      );
    } else {
      return (
        parseFloat(b[trainSortConfigFirstYear.key]) -
        parseFloat(a[trainSortConfigFirstYear.key])
      );
    }
  });

  const sortedSecondYearData = [...secondYearData].sort((a, b) => {
    if (trainSortConfigSecondYear.direction === "asc") {
      return (
        parseFloat(a[trainSortConfigSecondYear.key]) -
        parseFloat(b[trainSortConfigSecondYear.key])
      );
    } else {
      return (
        parseFloat(b[trainSortConfigSecondYear.key]) -
        parseFloat(a[trainSortConfigSecondYear.key])
      );
    }
  });

  const sortedThirdYearData = [...thirdYearData].sort((a, b) => {
    if (trainSortConfigThirdYear.direction === "asc") {
      return (
        parseFloat(a[trainSortConfigThirdYear.key]) -
        parseFloat(b[trainSortConfigThirdYear.key])
      );
    } else {
      return (
        parseFloat(b[trainSortConfigThirdYear.key]) -
        parseFloat(a[trainSortConfigThirdYear.key])
      );
    }
  });

  const sortedFourthYearData = [...fourthYearData].sort((a, b) => {
    if (trainSortConfigFourthYear.direction === "asc") {
      return (
        parseFloat(a[trainSortConfigFourthYear.key]) -
        parseFloat(b[trainSortConfigFourthYear.key])
      );
    } else {
      return (
        parseFloat(b[trainSortConfigFourthYear.key]) -
        parseFloat(a[trainSortConfigFourthYear.key])
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

      {/** ---------------------- Different charts ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
                <LineChart />
                <BarChart />
            </div> */}

      {/** ---------------------- Different stats content 2 ------------------------- */}
      {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />
                <PageStats />
            </div> */}

      {/** ---------------------- Test Data Table ------------------------- */}
      <div>
        <TitleCard title="Test Data">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_SMAPE")}
                  >
                    Test SMAPE
                    {testSortConfig.key === "Test_SMAPE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_MAPE")}
                  >
                    Test MAPE
                    {testSortConfig.key === "Test_MAPE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_MAE")}
                  >
                    Test MAE
                    {testSortConfig.key === "Test_MAE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_RMSE")}
                  >
                    Test RMSE
                    {testSortConfig.key === "Test_RMSE" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTestSort("Test_R2")}
                  >
                    Test R2
                    {testSortConfig.key === "Test_R2" &&
                      (testSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTestData.map((u, k) => (
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

      {/** ---------------------- Train Data Table ------------------------- */}
      <div className="mt-10">
        <TitleCard title="Train Data" topMargin="mt-2">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfig.key === "Train_SMAPE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfig.key === "Train_MAPE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfig.key === "Train_MAE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfig.key === "Train_RMSE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_R2")}
                  >
                    Train R2
                    {trainSortConfig.key === "Train_R2" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTrainData.map((u, k) => (
                  <tr key={k}>
                    <th>{k + 1}</th>
                    <td>{u.Algorithm}</td>
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

      {/** ---------------------- 1st Year ------------------------- */}
      <div className="mt-10">
        <TitleCard title="1st Year" topMargin="mt-2">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFirstYear("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFirstYear("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfigFirstYear.key === "Train_SMAPE" &&
                      (trainSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFirstYear("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfigFirstYear.key === "Train_MAPE" &&
                      (trainSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFirstYear("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfigFirstYear.key === "Train_MAE" &&
                      (trainSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFirstYear("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfigFirstYear.key === "Train_RMSE" &&
                      (trainSortConfigFirstYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFirstYear("Train_R2")}
                  >
                    Train R2
                    {trainSortConfigFirstYear.key === "Train_R2" &&
                      (trainSortConfigFirstYear.direction === "asc" ? (
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
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

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
                    onClick={() => handleTrainSortSecondYear("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortSecondYear("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfigSecondYear.key === "Train_SMAPE" &&
                      (trainSortConfigSecondYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortSecondYear("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfigSecondYear.key === "Train_MAPE" &&
                      (trainSortConfigSecondYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortSecondYear("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfigSecondYear.key === "Train_MAE" &&
                      (trainSortConfigSecondYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortSecondYear("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfigSecondYear.key === "Train_RMSE" &&
                      (trainSortConfigSecondYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortSecondYear("Train_R2")}
                  >
                    Train R2
                    {trainSortConfigSecondYear.key === "Train_R2" &&
                      (trainSortConfigSecondYear.direction === "asc" ? (
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
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
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
                    onClick={() => handleTrainSortThirdYear("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortThirdYear("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfigThirdYear.key === "Train_SMAPE" &&
                      (trainSortConfigThirdYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortThirdYear("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfigThirdYear.key === "Train_MAPE" &&
                      (trainSortConfigThirdYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortThirdYear("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfigThirdYear.key === "Train_MAE" &&
                      (trainSortConfigThirdYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortThirdYear("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfigThirdYear.key === "Train_RMSE" &&
                      (trainSortConfigThirdYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortThirdYear("Train_R2")}
                  >
                    Train R2
                    {trainSortConfigThirdYear.key === "Train_R2" &&
                      (trainSortConfigThirdYear.direction === "asc" ? (
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
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
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
                    onClick={() => handleTrainSortFourthYear("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFourthYear("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfigFourthYear.key === "Train_SMAPE" &&
                      (trainSortConfigFourthYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFourthYear("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfigFourthYear.key === "Train_MAPE" &&
                      (trainSortConfigFourthYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFourthYear("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfigFourthYear.key === "Train_MAE" &&
                      (trainSortConfigFourthYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFourthYear("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfigFourthYear.key === "Train_RMSE" &&
                      (trainSortConfigFourthYear.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSortFourthYear("Train_R2")}
                  >
                    Train R2
                    {trainSortConfigFourthYear.key === "Train_R2" &&
                      (trainSortConfigFourthYear.direction === "asc" ? (
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
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div>

      {/** ---------------------- 4th Year ------------------------- */}

      {/* <div className="mt-10">
        <TitleCard title="Split Data" topMargin="mt-2">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th></th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Algorithm")}
                  >
                    Forecasting Algorithm
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_SMAPE")}
                  >
                    Train SMAPE
                    {trainSortConfig.key === "Train_SMAPE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_MAPE")}
                  >
                    Train MAPE
                    {trainSortConfig.key === "Train_MAPE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_MAE")}
                  >
                    Train MAE
                    {trainSortConfig.key === "Train_MAE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_RMSE")}
                  >
                    Train RMSE
                    {trainSortConfig.key === "Train_RMSE" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                  <th
                    className="cursor-pointer normal-case"
                    onClick={() => handleTrainSort("Train_R2")}
                  >
                    Train R2
                    {trainSortConfig.key === "Train_R2" &&
                      (trainSortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-5 h-5 ml-2" />
                      ) : (
                        <ChevronDownIcon className="w-5 h-5 ml-2" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedSplitData.map((u, k) => (
                  <tr key={k}>
                    <th>{k + 1}</th>
                    <td>{u.Algorithm}</td>
                    <td>{u.Train_SMAPE}</td>
                    <td>{u.Train_MAPE}</td>
                    <td>{u.Train_MAE}</td>
                    <td>{u.Train_RMSE}</td>
                    <td>{u.Train_R2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TitleCard>
      </div> */}
    </>
  );
}

export default Dashboard;
